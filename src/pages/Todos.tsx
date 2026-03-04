import { ChangeEvent, useState } from "react";
import Paginator from "../components/ui/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("DESC");
  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: [`paginatedTodos, ${page}, ${pageSize}, ${sortBy}`],
    url: "/todos",
    config: {
      params: {
        filters: {
          user: { id: { $eq: userData.user.id } },
        },
        sort: [`createdAt:${sortBy}`],
        pagination: { page, pageSize },
      },
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // Handlers
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
      <div className="space-y-2">
        <div className="flex justify-end space-x-2 mb-3">
          <div className=" w-25 h-10 p-2 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
          <div className=" w-22 h-10 p-2 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
        </div>
        {Array.from({ length: pageSize }, (_, idx) => (
          <div key={idx} className="w-full h-10 bg-gray-200 rounded-md  dark:bg-gray-700 animate-loading skeleton"></div>
        ))}
      </div>
    );
console.log(!data.data.length);
  if (error) return <h3>An error has occurred: {error.message}</h3>;

  return (
    <section>
      <div className="flex justify-end my-3 gap-2 ">
        <select
          className="border-2 border-indigo-600 rounded-md p-2"
          value={pageSize}
          onChange={onChangePageSize}
        >
          <option disabled>Page Size</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={sortBy}
            onChange={onChangeSortBy}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
      </div>
      {data.data.length ? (
        data.data.map((todo: ITodo) => {
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
      <div className="mt-5">
        <Paginator
          page={page}
          pageCount={data.meta.pagination.pageCount}
          isLoading={isLoading}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          total={data.meta.pagination.total}
        />
      </div>
    </section>
  );
};

export default TodosPage;
