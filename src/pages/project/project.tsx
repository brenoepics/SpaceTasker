import { FC, useEffect, useState } from "react";
import { Card, Checkbox, Button, TextInput, Modal } from "flowbite-react";
import ReactCountryFlag from "react-country-flag";
import { useParams } from "react-router-dom";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import PJ from "../../data/projects.json";
import Project from "../../types/types";
import { HiOutlineExclamationCircle, HiPlus, HiTrash } from "react-icons/hi";
import KanbanPage from "../kanban";
import NotFoundPage from "../404";

export type ProjectParams = {
  projectId: string;
};

const ProjectPage: FC = () => {
  const [isDamaged, setIsDamaged] = useState<boolean>(false);
  const [objects, setobjects] = useState<string[]>([]);
  const [markAsDone, setMarkAsDone] = useState<string[]>([]);
  const [newStep, setNewStep] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [modalStep, setModalStep] = useState<string>("");
  const { projectId } = useParams<ProjectParams>();
  const _projects: Project[] = [...PJ];

  if (projectId === undefined || _projects === undefined)
    return <NotFoundPage />;

  const project: Project | undefined = _projects.find(
    (project) => project.id === parseInt(projectId)
  );

  if (project === undefined) return <NotFoundPage />;

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setMarkAsDone((prevobjects) => [...prevobjects, value]);
    } else {
      setMarkAsDone((prevobjects) =>
        prevobjects.filter((step) => step !== value)
      );
    }
  };

  const handleTaskDelete = (value: string) => {
    setobjects((prevobjects) => prevobjects.filter((step) => step !== value));
  };

  const handleNewStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewStep(event.target.value);
  };

  const isDone = (step: string) => {
    return markAsDone.includes(step);
  };

  const handleAddStep = () => {
    if (newStep.trim() !== "" && newStep.length < 90) {
      setobjects((prevobjects) => [...prevobjects, newStep]);
      setNewStep("");
    }
  };

  useEffect(() => {
    if (project.status === "Avariado") setIsDamaged(true);

    if (project.objects !== undefined) setobjects(project.objects);

    window.addEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };

  return (
    <NavbarSidebarLayout>
      <div className="md:max-w-l px-4 pt-6 bg-transparent">
        <Card className="md:max-w-full w-full flex bg-bit-transparent">
          <div className={innerWidth >= 768 ? "w-full flex" : "w-full"}>
            <div className={innerWidth >= 768 ? "w-1/3 pr-6" : "w-full pr-6"}>
              <img
                src={"../images/projects/" + project.id + ".png"}
                alt={project.name}
                className="object-cover h-full w-full rounded-3xl"
              />
            </div>
            <div
              className={
                innerWidth >= 768
                  ? ""
                  : "mt-6 w-full flex flex-col justify-center"
              }
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {project.name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode={project.country}
                  style={{
                    fontSize: "4em",
                    lineHeight: "4em",
                  }}
                  svg
                />
              </p>
              <div className="mt-4">
                <Button
                  gradientMonochrome={isDamaged ? "failure" : "success"}
                  onClick={() => setIsDamaged(!isDamaged)}
                >
                  {isDamaged ? "Avariado" : "Intacto"}
                </Button>
              </div>
              <div className="mt-6">
                <h6 className="text-lg font-medium text-gray-900 dark:text-white">
                  Descrição
                </h6>
                <p className="text-gray-700 dark:text-gray-400 mt-2">
                  {project.description}
                </p>
              </div>
              {objects && (
                <>
                  <div className="mt-6">
                    <h6 className="text-lg font-medium text-gray-900 dark:text-white">
                      Objetos a serem reparados
                    </h6>
                    <ul className="pl-6 mt-2 dark:text-white">
                      {objects.map((element) => (
                        <li key={element} className="flex items-center">
                          <Checkbox
                            value={element}
                            checked={isDone(element)}
                            onChange={handleTaskChange}
                            className="mr-2"
                          />
                          <span className="dark:text-gray-200">{element}</span>
                          <HiTrash
                            className="ml-3"
                            size={14}
                            color="red"
                            onClick={() => {
                              setModalStep(element);
                              setShowModal(true);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h6 className="text-lg font-medium text-gray-900 dark:text-white">
                      Adicionar novo objeto
                    </h6>
                    <div className="flex items-center mt-2">
                      <TextInput
                        icon={HiPlus}
                        id="add-step"
                        name="add-step"
                        placeholder="Ex: Lâmpada"
                        required
                        value={newStep}
                        onChange={handleNewStepChange}
                        type="text"
                        className="mr-2"
                      />
                      <Button
                        gradientMonochrome={"info"}
                        onClick={handleAddStep}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
        <Card className="md:max-w-full w-full flex bg-bit-transparent mt-5">
          <KanbanPage />
        </Card>
      </div>
      <Modal
        show={showModal}
        size="md"
        popup={true}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Você tem certeza que deseja excluir o passo{" "}
              {modalStep && " " + modalStep}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  handleTaskDelete(modalStep),
                    setModalStep(""),
                    setShowModal(false);
                }}
              >
                Sim, tenho certeza
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setModalStep(""), setShowModal(false);
                }}
              >
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </NavbarSidebarLayout>
  );
};

export default ProjectPage;
