const routes = {
  private: {
    client: {
      principal: "/client",
      routes: ["/client"],
    },
    professional: {
      principal: "/professional",
      routes: ["/professional"],
    },
    admin: {
      principal: "/admin",
      routes: ["/admin"],
    },
  },
  public: {
    principal: "/login",
    routes: ["/login", "/registro", "/confirmar_conta", "/conta_confirmada"],
  },
};

export default routes;
