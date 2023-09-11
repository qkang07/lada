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
  CompSchemaBase,
  StatePropDef,
  UIComp,
} from "@/libs/core/Def";
import PropsEditor from "@/components/PropsEditor";
import FocusFrame from "@/components/FocusFrame";
import DesignerHeader from "./Header";
import { ResizeBox } from "@arco-design/web-react";
import DataSources from "./DataSource";
import EditorStack from "@/components/EditorStack";
import TreeView from "./TreeView";
import SidePane from "@/components/SidePane";
import { action, autorun, makeAutoObservable, observable } from "mobx";
import { Optional, randomId } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useRequest } from "ahooks";
import { compMan } from "@/components/manager";
import { BindingContainer } from "@/libs/core/BindingContainer";
import { CompAgent } from "@/libs/core/CompAgent";
import { observer } from "mobx-react";
import BindingPlate, { BDPlateType } from "../BindingPlate";
import { schemaRef } from "@/pages/PageRunner";

type CompDomInfo = {
  id: string;
  dom: HTMLElement;
};

export interface CompInfo extends CompDomInfo {
  agent: CompAgent<UIComp.Schema>;
}

export type SlotInfo = {
  dom: HTMLElement;
  // id: string
  name: string;
  compDomInfo: CompDomInfo;
  compAgent: CompAgent<UIComp.Schema, UIComp.Def>;
};

function findComp(dom: HTMLElement): CompDomInfo | undefined {
  const sib = dom.previousSibling as HTMLElement;
  if (sib && sib.dataset?.ladaCompId) {
    const id = sib.dataset.ladaCompId;
    return {
      id,
      dom,
    };
  } else if (dom.parentElement && !dom.parentElement.dataset.ladaCanvas) {
    return findComp(dom.parentElement);
  }
  return void 0;
}

//  这个可以优化
function findSlot(
  dom: HTMLElement
): { compDomInfo: CompDomInfo; name: string; dom: HTMLElement } | undefined {
  if (dom.dataset.ladaCanvas) {
    return undefined;
  }

  if (dom.dataset.slotName) {
    const compDomInfo = findComp(dom)!;
    return {
      compDomInfo,
      name: dom.dataset.slotName!,
      dom,
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
  deleteComp?: (id: any) => any;
  openBinding?: (lookingFor:BindingElement, propName: string) => void;
};

export const DesignerContext = createContext<DesignerContextType>({} as any);

type Props = {
  bdConSchema?: BindingScopeSchema;
};

const Designer = observer((props: Props) => {
  const { bdConSchema } = props;

  const nav = useNavigate();

  const canvasRef = useRef<CanvasRef | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const bdCon = canvasRef.current?.bdCon

  const bdPlateRef = useRef<BDPlateType>(null);

  // const bindingRef = useRef<{
  //   plateVisible?: boolean
  // }>({})

  const currentRefs = useRef<{
    compInfo?: CompInfo;
    slotInfo?: SlotInfo;
  }>(
    observable({
      compInfo: undefined,
      slotInfo: undefined,
    })
  );

  const currentSlotInfoRef = observable(useRef<SlotInfo>());
  const currentSlotInfo = currentSlotInfoRef.current;

  const [obsSchema, setObsSchema] = useState<BindingScopeSchema>();

  useEffect(() => {
    if (bdConSchema) {
      setObsSchema(
        observable<BindingScopeSchema>(bdConSchema, undefined, { deep: true })
      );
    }
  }, [bdConSchema]);

  const handleCompAdd = (name: string) => {
    addComp(name);
  };

  const addComp = action((provider: string) => {
    const compDef = compMan.getComp(provider);
    const id = randomId();
    let schema: UIComp.Schema = {
      provider,
      name: provider + id,
      id,
    };

    if (compDef?.createSchema) {
      schema = compDef.createSchema(schema);
    }

    const slotInfo = currentRefs.current.slotInfo;

    if (slotInfo) {
      const slotDef = slotInfo.compAgent.def.slots?.find(
        (s) => s.name === slotInfo.name
      );
      const slotSchema = slotInfo.compAgent.schema.slots?.find(
        (s) => s.name === slotInfo.name
      );
      // single 和 loop 的 slot 只能放一个子组件
      if (!slotSchema?.children?.length || slotDef?.type === "list") {
        slotSchema?.children?.push(schema);
      }
    } else {
      obsSchema?.uiRoot?.slots?.[0].children?.push(schema);
      // newComp.parent = runtimeSchema
      // runtimeSchema.slots?.[0].children?.push(newComp)
    }
  });

  const handleCanvasClick = action(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const source = e.nativeEvent.target as HTMLElement;
      const compDomInfo = findComp(source);
      const bdCon = canvasRef.current?.bdCon;
      if (compDomInfo?.id) {
        const agent = bdCon?.compMap.get(compDomInfo.id)!;
        currentRefs.current.compInfo = {
          id: compDomInfo.id,
          dom: compDomInfo.dom,
          agent,
        };
      }

      const theSlot = findSlot(source);
      if (theSlot?.name) {
        const agent = bdCon?.compMap.get(theSlot.compDomInfo.id);
        currentRefs.current.slotInfo = {
          name: theSlot.name,
          dom: theSlot.dom,
          compDomInfo: theSlot.compDomInfo,
          compAgent: agent!,
        };
      }
    }
  );

  const deleteComp = action((id: string) => {});

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
        currentCompAgent: currentRefs.current.compInfo?.agent,
        openBinding,
      }}
    >
      <div className={styles.designer}>
        <div className={styles.head}>
          <DesignerHeader
            onSave={() => {}}
            onPreview={() => {
              // TODO
              schemaRef.value = obsSchema;
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
                  bdConSchema?.dataSources.push(ds)
                  
                  // pageSchema.dataSources.push(ds)
                }}/>,
                <TreeView schema={obsSchema?.uiRoot!} />,
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
              containerDom={canvasContainerRef.current as HTMLElement}
              target={currentRefs.current.compInfo?.dom}
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
});

export default Designer;
