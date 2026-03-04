const TodoSkeleton = () => {
  return (
    <div className="flex items-top justify-between">
      <div className="md:w-100 w-50 h-9 bg-gray-200 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
      <div className="flex items-center space-x-2">
        <div className=" w-18 h-9 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
        <div className=" w-22 h-9 bg-gray-300 rounded-md dark:bg-gray-700 animate-loading skeleton"></div>
      </div>
    </div>
  );
};

export default TodoSkeleton;
