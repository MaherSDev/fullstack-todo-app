import { useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  const [isEditModalOpen ,setIsEditModalOpen] = useState(false)
  const [todoToEdit ,setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: ""
  })


  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  // ** Hanlers
  const onCloseEditModal = () => {
    setTodoToEdit({
    id: 0,
    title: "",
    description: ""
  })
    setIsEditModalOpen(false)
  }
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo)
    setIsEditModalOpen(true)
  };

  if (isLoading) return <h3>Loading...</h3>;
  if (error) return <h3>An error has occurred: {error.message}</h3>;

  return (
    <div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => {
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">
                {todo.id} - {todo.title}
              </p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() => onOpenEditModal(todo)}
                >
                  Edit
                </Button>
                <Button
                  variant={"danger"}
                  size={"sm"}
                  // onClick={() => openConfirmModal(todo)}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <h3 className="text-center text-gray-500">No todos found.</h3>
      )}
      <Modal isOpen={isEditModalOpen} closeModal={onCloseEditModal} title="Edit this todo">
        <div className="space-y-3">
          <Input value={todoToEdit.title} />
          <Textarea value={todoToEdit.description} />
          <div className="flex flex-wrap items-center space-x-3 gap-y-2">
            <Button className="bg-designColor hover:bg-hoverColor" type="submit">
              submit
            </Button>
            <Button
              variant={"cancel"}
              type="button"
              onClick={() => onCloseEditModal()}
            >
              cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
