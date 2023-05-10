/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { Fragment } from "react";
import { useState } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import kanbanBoards from "../data/kanban.json";
import { ReactSortable } from "react-sortablejs";
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import {
  HiArrowsExpand,
  HiClipboard,
  HiClipboardCopy,
  HiEye,
  HiFolder,
  HiPaperClip,
  HiPencilAlt,
  HiPlus,
} from "react-icons/hi";

interface KanbanBoard {
  id: number;
  title: string;
  tasks: KanbanItem[];
}

interface KanbanItem {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  daysLeft: number;
  attachment?: string;
  members: KanbanItemMember[];
}

interface KanbanItemMember {
  id: number;
  name: string;
  avatar: string;
}

const generateRandom = () => {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();

  // Multiply the random number by the current timestamp to create a unique ID
  const uniqueId = randomNumber * Date.now();

  // Convert the unique ID to an integer and return it
  return Math.floor(uniqueId);
};
const KanbanPage: FC = function () {
  const [list, setList] = useState<KanbanBoard[]>(kanbanBoards);
  const [isOpen, setOpen] = useState(false);
  const [tboardId, setTboardId] = useState(1); // [1, 2, 3, 4
  const [tname, setTname] = useState("");
  const [tdescription, setTdescription] = useState("");
  const [tdaysLeft, setTdaysLeft] = useState(1);
  const createCard = () => {
    // Assuming you have a data structure to store boards and cards
    // Retrieve the board with the specified ID
    const board = list.find((board) => board.id === tboardId);

    // If the board exists
    if (board) {
      // Generate a unique ID for the new card
      const newCardId: number = generateRandom();

      // Create a new card object
      const newCard: KanbanItem = {
        id: newCardId,
        name: tname,
        description: tdescription,
        completed: false,
        daysLeft: tdaysLeft,
        members: [],
      };

      // Add the new card to the board's list of cards
      board.tasks.push(newCard);

      setTboardId(1);
      setTname("");
      setTdescription("");
      setTdaysLeft(1);

      // Return the newly created card
      return newCard;
    }

    // If the board doesn't exist, return null or handle the error accordingly
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="mb-6 flex items-start justify-start space-x-4 px-4">
          {list.map((board) => (
            <div key={board.id}>
              <div className="py-4 text-base font-semibold text-gray-900 dark:text-gray-300">
                {board.title}
              </div>
              <div className="mb-6 space-y-4">
                <ReactSortable
                  animation={100}
                  forceFallback
                  group="kanban"
                  list={board.tasks}
                  setList={(tasks) =>
                    setList((list) => {
                      const newList = [...list];
                      const index = newList.findIndex(
                        (item) => item.id === board.id
                      );
                      newList[index]!.tasks = tasks;
                      return newList;
                    })
                  }
                >
                  {board.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="mb-4 w-[28rem] cursor-grab rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between pb-4">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {task.name}
                        </div>
                        <div className="w-8"></div>
                      </div>
                      <div className="flex flex-col">
                        {task.attachment && (
                          <img
                            alt=""
                            src={task.attachment}
                            className="mb-3 rounded-lg"
                          />
                        )}
                        <div className="pb-4 text-sm font-normal text-gray-700 dark:text-gray-400">
                          {task.description}
                        </div>
                        <div className="flex justify-between">
                          {!task.completed && (
                            <div className="flex items-center justify-center rounded-lg bg-purple-100 px-3 text-sm font-medium text-purple-800 dark:bg-purple-200">
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              faltam {task.daysLeft} dias
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </ReactSortable>
              </div>
              <>
                <button
                  onClick={() => {
                    setTboardId(board.id), setOpen(true);
                  }}
                  className="flex w-full items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed border-gray-200 px-5 py-2 font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Adicionar outra tarefa
                </button>
                <Modal onClose={() => setOpen(false)} show={isOpen}>
                  <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
                    <strong>Adicionar nova tarefa</strong>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                      <div className="mb-4 grid grid-cols-1 gap-y-2">
                        <Label htmlFor="taskName">Nome da tarefa</Label>
                        <TextInput
                          id="taskName"
                          name="taskName"
                          value={tname}
                          onChange={(e) => setTname(e.target.value)}
                          placeholder="Verificar o estado do experimento."
                        />
                      </div>
                      <div className="mb-4 grid grid-cols-1 gap-y-2">
                        <Label htmlFor="description">Descrição da tarefa</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={tdescription}
                          onChange={(e) => setTdescription(e.target.value)}
                          placeholder="Verificar o estado do experimento, e se necessário, realizar a troca de reagentes."
                          rows={6}
                        />
                      </div>
                      <div className="mb-4 grid grid-cols-1 gap-y-2">
                        <Label htmlFor="prazo">Prazo</Label>
                        <TextInput
                          id="days"
                          name="days"
                          type="number"
                          onChange={(e) =>
                            setTdaysLeft(parseInt(e.target.value))
                          }
                          value={tdaysLeft}
                          placeholder="Verificar o estado do experimento, e se necessário, realizar a troca de reagentes."
                        />
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <div className="flex items-center gap-x-3">
                      <Button
                        color="primary"
                        onClick={() => {
                          createCard(), setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-x-2">
                          <HiPlus className="text-lg" />
                          Adicionar
                        </div>
                      </Button>
                      <Button color="gray" onClick={() => setOpen(false)}>
                        Fechar
                      </Button>
                    </div>
                  </Modal.Footer>
                </Modal>
              </>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;
