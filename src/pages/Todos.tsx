import TodoSkeleton from "../components/TodoSkeleton";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";

// Handlers
const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: ["paginatedTodos"],
    url: "/users/me?populate=todos&status=draft",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading)
    return (
      <div className="space-y-5">
        <div className="w-fit mx-auto my-10">
          <div className=" w-40 h-10 bg-gray-300 rounded-md dark:bg-gray-700 w-12"></div>
        </div>
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );  

  if (error) return <h3>An error has occurred: {error.message}</h3>;

  return (
    <section className="max-w-2xl mx-auto">
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
            </div>
          );
        })
      ) : (
        <h3 className="text-center text-gray-500">No todos found.</h3>
      )}
    </section>
  );
};

export default TodosPage;
