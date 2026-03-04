import { ChangeEvent, FormEvent, useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";
import Paginator from "./ui/Paginator";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const defaultTodoToAdd = {
    title: "",
    description: "",
  };
  const defaultTodo = {
    id: 0,
    documentId: "",
    title: "",
    description: "",
  };
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("DESC");
  const [queryVersion, setQueryVersion] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodo);
  const [todoToAdd, setTodoToAdd] = useState(defaultTodoToAdd);

  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: ["todoList", `${queryVersion}, ${page}, ${pageSize}, ${sortBy}`],
    url: "/todos",
    config: {
      params: {
        filters: {
          user: { id: { $eq: userData.user.id } },
        },
        sort: [`createdAt:${sortBy}`],
        pagination: { page, pageSize},
      },
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ** Handlers
  const onCloseConfirmModal = () => {
    setTodoToEdit(defaultTodo);
    setIsConfirmModalOpen(false);
  };
  const onOpenConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsConfirmModalOpen(true);
  };
  const onCloseEditModal = () => {
    setTodoToEdit(defaultTodo);
    setIsEditModalOpen(false);
  };
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };
  const onCloseAddModal = () => {
    setTodoToAdd(defaultTodoToAdd);
    setIsAddModalOpen(false);
  };
  const onOpenAddModal = () => setIsAddModalOpen(true);

  const submitToAddHandler = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsUpdated(true);

    const { title, description } = todoToAdd;
    try {
      const res = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData.user.documentId] } },
        { headers: { Authorization: `Bearer ${userData.jwt}` } },
      );
      if (res.status >= 200 && res.status <= 300) {
        setQueryVersion((prev) => prev + 1);
        onCloseAddModal();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdated(false);
    }
  };
  const submitToEditHandler = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsUpdated(true);

    const { documentId, title, description } = todoToEdit;
    try {
      const res = await axiosInstance.put(
        `/todos/${documentId}`,
        { data: { title, description } },
        { headers: { Authorization: `Bearer ${userData.jwt}` } },
      );

      if (res.status === 200) {
        setQueryVersion((prev) => prev + 1);
        onCloseEditModal();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdated(false);
    }
  };

  const onRemoveHandler = async () => {
    setIsUpdated(true);

    try {
      const { status } = await axiosInstance.delete(
        `/todos/${todoToEdit.documentId}`,
        { headers: { Authorization: `Bearer ${userData.jwt}` } },
      );

      if (status >= 200 && status <= 299) {
        setQueryVersion((prev) => prev + 1);
        onCloseConfirmModal();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdated(false);
    }
  };

  const onChangeToAddHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = evt.target;

    setTodoToAdd((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onChangeHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = evt.target;

    setTodoToEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  if (isLoading)
    return (
      <div className="space-y-3">
        <div className="mx-auto my-2">
          {/* <div className="relative overflow-hidden w-40 h-10 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div> */}
          <div className="flex justify-between">
            <div className="w-40 h-10 bg-gray-200 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
            <div className="flex justify-end space-x-2 mb-3">
              <div className=" w-25 h-10 p-2 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
              <div className=" w-22 h-10 p-2 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
            </div>
          </div>
        </div>
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  if (error) return <h3>An error has occurred: {error.message}</h3>;

  return (
    <div className="space-y-1">
      <div className="flex justify-between my-3">
        <Button variant={"default"} size={"sm"} onClick={onOpenAddModal}>
          Create new Todo
        </Button>
        <div className="flex justify-end gap-2 ">
          <select
            className="border-2 border-indigo-600 rounded-md p-1"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <select
              className="border-2 border-indigo-600 rounded-md p-1"
              value={sortBy}
              onChange={onChangeSortBy}
            >
              <option disabled>Sort by</option>
              <option value="ASC">Oldest</option>
              <option value="DESC">Latest</option>
            </select>
        </div>
      </div>
      {data.data.length ? (
        data.data.map((todo: ITodo) => {
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 px-3 py-2 rounded-md even:bg-gray-100"
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
                  onClick={() => onOpenConfirmModal(todo)}
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
      {data.data.length && (
        <div className="mt-5">
          <Paginator
            page={page}
            pageCount={data.meta.pagination.pageCount}
            isLoading={isLoading}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            total={data.meta.pagination.total}
          />
        </div>)}
      {/* Add Todo MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        closeModal={onCloseAddModal}
        title="Create new Todo"
      >
        <form className="space-y-3" onSubmit={submitToAddHandler}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeToAddHandler}
          />
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={onChangeToAddHandler}
          />
          <div className="flex flex-wrap items-center space-x-3 gap-y-2">
            <Button
              className="bg-designColor hover:bg-hoverColor"
              type="submit"
              isLoading={isUpdated}
            >
              Create
            </Button>
            <Button
              variant={"cancel"}
              type="button"
              onClick={() => onCloseAddModal()}
            >
              cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Update Todo MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseEditModal}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={submitToEditHandler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex flex-wrap items-center space-x-3 gap-y-2">
            <Button
              className="bg-designColor hover:bg-hoverColor"
              type="submit"
              isLoading={isUpdated}
            >
              Update
            </Button>
            <Button
              variant={"cancel"}
              type="button"
              onClick={() => onCloseEditModal()}
            >
              cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Delete Todo MODAL */}
      <Modal
        isOpen={isConfirmModalOpen}
        closeModal={onCloseConfirmModal}
        title="Are you sure you want to delete this product?"
        description="Deleting this todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex flex-wrap items-center space-x-3 gap-y-2">
          <Button
            variant={"danger"}
            type="button"
            onClick={onRemoveHandler}
            isLoading={isUpdated}
          >
            Yes, remove
          </Button>
          <Button
            variant={"cancel"}
            type="button"
            onClick={onCloseConfirmModal}
          >
            cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
