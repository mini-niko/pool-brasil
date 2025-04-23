function Container({ children }) {
  return (
    <div className="flex-1 flex flex-col items-center py-12 md:px-64 gap-8">
      {children}
    </div>
  );
}

export default Container;
