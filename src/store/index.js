import { createStore } from "vuex";
import orderBook from "./module/orderBook";

const store = createStore({
   modules: {
      orderBook: orderBook,
   },
});

export default store;
