import {
  Modal,
  Button,
  Center,
  Container,
  Flex,
  Textarea,
  MultiSelect,
} from "@mantine/core";
import { Inter } from "next/font/google";
import { useState } from "react";
import { TbBinaryTree2, TbBulb, TbLogout } from "react-icons/tb";

const inter = Inter({ subsets: ["latin"] });

export default function App() {
  const [showMonad, setShowMonad] = useState(true);
  const randomItems = [
    "Post Modernist Philosophy",
    "Operating Systems",
    "Organic Chemistry",
  ];

  return (
    <div className={inter.className}>
      <div className="flex w-screen h-screen">
        <div className="w-1/5">
          <Sidebar
            items={randomItems.map((item) => ({ title: item }))}
            showLearnModal={() => setShowMonad(true)}
          />
        </div>
        <div>
          <LearnModal visible={showMonad} setVisible={setShowMonad} />
        </div>
      </div>
    </div>
  );
}

type SidebarProps = {
  items: {
    title: string;
  }[];
  showLearnModal: () => void;
};

function Sidebar(props: SidebarProps) {
  const items = props.items.map((item, i) => {
    return <SidebarItem title={item.title} key={i} />;
  });

  return (
    <div className="flex flex-col justify-between h-screen pb-6 mt-2 shadow-md gap-2">
      <div className="flex flex-col gap-2">
        <NewItem onClick={() => props.showLearnModal()} />
        {items}
      </div>

      <div>
        <LogoutButton />
      </div>
    </div>
  );
}

function SidebarItem(props: { title: string }) {
  return (
    <Btn icon={<TbBinaryTree2 />} className="hover:bg-gray-100">
      {props.title}
    </Btn>
  );
}

function NewItem(props: { onClick: () => void }) {
  return (
    <Btn
      icon={<TbBulb />}
      className="text-white bg-mblue hover:bg-mbluedark"
      onClick={props.onClick}
    >
      Learn Something New
    </Btn>
  );
}

function LogoutButton() {
  return (
    <Btn icon={<TbLogout />} className="text-white bg-red-600 hover:bg-red-700">
      Logout
    </Btn>
  );
}

function Btn(props: {
  className?: string;
  children: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  let c = "flex gap-2 justify-center py-3 text-sm cursor-pointer rounded-md";
  if (props.icon) c += " px-5 mx-2";
  if (props.className) c += " " + props.className;

  let btnc = "grow";
  if (!props.icon) btnc += "px-5";

  return (
    <div className={c} onClick={props.onClick}>
      {props.icon && (
        <div className="flex items-center justify-center">{props.icon}</div>
      )}
      <div className={btnc}>{props.children}</div>
    </div>
  );
}

function LearnModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
}) {
  return (
    <Modal
      title="Learn Something New"
      centered
      onClose={() => setVisible(false)}
      opened={visible}
    >
      <Textarea label="What do you want to learn?" withAsterisk />
      <MultiSelect
        label="What do you already know?"
        data={[]}
        placeholder=""
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        withAsterisk
        mt={20}
        //onCreate={(query) => {
        //const item = { value: query, label: query };
        //setData((current) => [...current, item]);
        //return item;
        //}}
      />
      <Btn className="mt-5 text-white bg-mblue hover:bg-mbluedark">
        Create Learning Path
      </Btn>
    </Modal>
  );
}
