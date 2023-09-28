import { BaseContext } from "@apollo/server";

interface MyContext extends BaseContext {
  isAuthenticated?: boolean;
}

export default MyContext;
