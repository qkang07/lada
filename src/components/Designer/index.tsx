import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./index.module.less";
import CompBox from "./CompBox";
import Canvas, { CanvasRef } from "@/components/Canvas";
import {
  BindingElement,
  BindingScopeSchema,
  BindingType,
  CompDefBase,
  CompSchemaBase,
  StatePropDef,
  UIComp,
} from "@/libs/core/Def";
import PropsEditor from "@/components/PropsEditor";
import FocusFrame, { FocusFrameType } from "@/components/FocusFrame";
import DesignerHeader from "./Header";
import { ResizeBox } from "@arco-design/web-react";
import DataSources from "./DataSource";
import EditorStack from "@/components/EditorStack";
import TreeView from "./TreeView";
import SidePane from "@/components/SidePane";
import { Optional, randomId } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useRequest } from "ahooks";
import { compMan } from "@/components/CompManager/manager";
import { BindingContainer } from "@/libs/core/BindingContainer";
import { CompAgent } from "@/libs/core/CompAgent";
import BindingPlate, { BDPlateType } from "../BindingPlate";
import { schemaRef } from "@/pages/PageRunner";
import { action, makeAutoObservable, toJS } from "mobx";

type CompDomInfo = {
  id: string;
  dom: HTMLElement;
};

export type SlotInfo = {
  
  // dom: HTMLElement; // 后面再用到
  // id: string
  name: string;
  compAgent: CompAgent<UIComp.Schema, UIComp.Def>;
  schema: UIComp.SlotSchema
};

function findComp(dom: HTMLElement): CompDomInfo | undefined {
  if(dom.dataset?.ladaAgentId) {
    const id = dom.dataset.ladaAgentId!;
    return {
      id,
      dom,
    };
  } else if (dom.parentElement && !dom.parentElement.dataset.ladaCanvas) {
    return findComp(dom.parentElement);
  }
  return void 0;
}

function findSlot(
  dom: HTMLElement
): { compDomInfo: CompDomInfo; name: string; } | undefined {
  if (dom.dataset.ladaCanvas) {
    return undefined;
  }

  if (dom.classList.contains('slot-holder') && dom.dataset?.slotName) {
    const compDomInfo = findComp(dom)!;
    return {
      compDomInfo,
      name: dom.dataset.slotName!,
    };
  } else if (dom.parentElement) return findSlot(dom.parentElement);
  
  return undefined;
}

// const defaultPageSchema = ():  => ({
//   name: 'New Page',
//   rootComp: {
//     provider: 'listLayout',
//     name: 'root',
//     slots: [{
//       name: 'default',
//       type: 'list',
//       children: []
//     }],
//   },
//   dataSources: []
// })

type DesignerContextType = {
  isDesign?: boolean;
  bdCon?: BindingContainer;
  currentCompAgent?: CompAgent<UIComp.Schema>;
  currentComp?: {
    def: CompDefBase
    schema:CompSchemaBase
  }
  currentSlot?: SlotInfo
  deleteComp?: (id: any) => any;
  openBinding?: (lookingFor:BindingElement, propName: string) => void;
};

export const DesignerContext = createContext<DesignerContextType>({} as any);

type Props = {
  bdConSchema?: BindingScopeSchema;
};

const Designer = (props: Props) => {
  const { bdConSchema } = props;

  const nav = useNavigate();

  const canvasRef = useRef<CanvasRef | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);


  const bdPlateRef = useRef<BDPlateType>(null);

  const focusFrameRef = useRef<FocusFrameType>(null)

  const [currentAgent, setCurrentAgent] = useState<CompAgent>()
  const [currentSlot, setCurrentSlot] = useState<SlotInfo>()

  const [obsSchema, setObsSchema] = useState<BindingScopeSchema>();

  useEffect(() => {
    if (bdConSchema) {
      setObsSchema(
        makeAutoObservable(bdConSchema,{},{deep: true})
      );
    }
  }, [bdConSchema]);

  const handleCompAdd = (name: string) => {
    addComp(name);
  };

  const addComp = action((provider: string) => {
    
    let schema = compMan.createSchema(provider) as UIComp.Schema

    if (currentSlot) {
      console.log(currentSlot)
      const slotDef = currentSlot.compAgent.def.slots?.find(
        (s) => s.name === currentSlot.name
      );
      const slotSchema = currentSlot.compAgent.schema.slots?.find(
        (s) => s.name === currentSlot.name
      );
      // single 和 loop 的 slot 只能放一个子组件
      if (!slotSchema?.children?.length || !slotDef?.single) {
        slotSchema?.children?.push(schema);
      }
    } else {
      obsSchema?.uiRoot?.slots?.[0].children?.push(schema);
      // newComp.parent = runtimeSchema
      // runtimeSchema.slots?.[0].children?.push(newComp)
    }
  })

  const deleteComp = (id: string) => {
  const bdCon = canvasRef.current?.bdCon
  const agent = bdCon?.agentMap.get(id);
    if(agent) {
      const plist = agent?.parentSlot?.children
      plist?.splice(plist.indexOf(agent.schema), 1)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const source = e.nativeEvent.target as HTMLElement;
      const compDomInfo = findComp(source);
      const bdCon = canvasRef.current?.bdCon;
      if (compDomInfo?.id) {
        const agent = bdCon?.agentMap.get(compDomInfo.id) ;
        setCurrentAgent(agent)
        focusFrameRef.current?.setCompDom(compDomInfo.dom)
      }

      const theSlot = findSlot(source);
      // debugger
      if (theSlot?.name) {
        const agent = bdCon?.agentMap.get(theSlot.compDomInfo.id) as CompAgent<UIComp.Schema, UIComp.Def>;
        setCurrentSlot({
          name: theSlot.name,
          // dom: theSlot.dom,
          // compDomInfo: theSlot.compDomInfo,
          compAgent: agent!,
          schema: agent.schema.slots!.find(s => s.name === 'default') || agent.schema.slots![0]
        })
      }
    }

  const handleTreeClick = (schema: UIComp.Schema) => {
    const agents = canvasRef.current?.bdCon?.schemaAgentMap.get(schema.id)
    console.log(agents)
    if(agents?.length) {
      const agent = agents[0] as CompAgent<UIComp.Schema, UIComp.Def>
      const dom = agent.findDom()
      setCurrentAgent(agent)
      console.log('comp dom',dom)
      focusFrameRef.current?.setCompDom(dom)
      setCurrentSlot({
        name: agent.parentSlot!.name,
        compAgent: agent.parentAgent!,
        schema: agent.schema.slots!.find(s => s.name === 'default') || agent.schema.slots![0]
        // dom: 

      })
    }
  }

  const choosePureComp = (id: string) => {
    const bdCon = canvasRef.current?.bdCon
    const agent = bdCon?.agentMap.get(id)
    if(agent) {
      setCurrentAgent(agent)
      focusFrameRef.current?.setCompDom(undefined)
    } else {
      // this should not happen
    }
  }



  const openBinding = (lookingFor: BindingElement, prop: string) => {
    bdPlateRef.current?.open({
      lookingFor,
      name: prop
    })
  };

  return (
    <DesignerContext.Provider
      value={{
        isDesign: true,
        deleteComp,
        bdCon: canvasRef.current?.bdCon,
        currentCompAgent: currentAgent,
        currentSlot,
        openBinding,
      }}
    >
      <div className={styles.designer}>
        <div className={styles.head}>
          <DesignerHeader
            onSave={() => {}}
            onPreview={() => {
              // TODO
              schemaRef.value = toJS(obsSchema);
              console.log(schemaRef.value)
              nav("/pagerunner");
            }}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.toolbox}>
            <EditorStack
              items={[
                <CompBox onCompClick={handleCompAdd} />,
                <DataSources schemas={bdConSchema?.dataSources || []} onAdd={ds => {
                  // 这里 schema 和 agent 的处理分开了。。
                  bdConSchema?.dataSources.push(ds)
                  const agent = canvasRef.current?.initPureComp?.(ds)
                  setCurrentAgent(agent)
                }}
                  onChoose={choosePureComp}
                />,
                <TreeView root={obsSchema?.uiRoot!} onNodeClick={handleTreeClick} onSlotClick={handleSlotClick} />,
              ]}
            />
          </div>
          <div className={styles.canvas} ref={canvasContainerRef}>
            <Canvas
              ref={canvasRef}
              onCanvasClick={handleCanvasClick}
              initSchema={obsSchema!}
            />
            <FocusFrame
              ref={focusFrameRef}
            />
          </div>
          <div className={styles.editor}>
            <PropsEditor />
          </div>
        </div>
        <BindingPlate
          ref={bdPlateRef}
        />
      </div>
    </DesignerContext.Provider>
  );
}

export default Designer;
