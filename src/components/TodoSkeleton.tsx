const TodoSkeleton = () => {
  return (
    <div className="flex items-top justify-between">
      <div>
        <div className="w-40 h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-loading skeleton"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className=" w-20 h-9 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
        <div className=" w-20 h-9 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
      </div>
    </div>
  );
};

export default TodoSkeleton;
