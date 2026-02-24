import { useEffect, useState } from "react";
import axiosInstance from "../config/axios.config";
import { ITodo } from "../interfaces";
import Button from "./ui/Button";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  useEffect(() => {
    try {
      axiosInstance
        .get("/users/me?populate=todos", {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        })
        .then((res) => setTodos(res.data.todos))
        .catch((err) => console.log("THE ERROR", err)); 
    } catch (error) {
      console.log(error);
    }
  }, [userData.jwt]);

  
  return (
    <div>
      {
        todos.map((todo: ITodo) => {
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
                  // onClick={() => onOpenEditModal(todo)}
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
      }
    </div>
  );
};

export default TodoList;
