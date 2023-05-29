import axios from "axios";

const orderBook = {
   namespaced: true,

   state: () => ({
      bids: [],
      asks: [],
      ourOrders: [],
      spread: 0,
      loading: false,
   }),

   mutations: {
      setOrderBook(state, { bids, asks }) {
         state.bids = bids;
         state.asks = asks;
      },
      setOurOrders(state, { bidPrice, bidQty, askPrice, askQty }) {
         state.ourOrders = [
            [bidPrice, bidQty],
            [askPrice, askQty],
         ];
      },
      setSpread(state, { bids, asks }) {
         if (state.bids.length > 0 && state.asks.length > 0) {
            const bestBid = Number(bids[0][0]);
            const bestAsk = Number(asks[0][0]);
            state.spread = bestAsk - bestBid;
         } else {
            state.spread = 0;
         }
      },
      setLoading(state, payload) {
         state.loading = payload;
      },
   },

   actions: {
      getOurOrders({ commit }) {
         axios
            .get("https://api.binance.com/api/v3/ticker/bookTicker", {
               params: {
                  symbol: "ETHBTC",
               },
            })
            .then(({ data }) => {
               commit("setOurOrders", data);
            })
            .catch((error) => {
               console.error("Ошибка при получении наших ордеров:", error);
            });
      },
      startOrderBookStream({ commit, dispatch }) {
         const streamUrl =
            "wss://stream.binance.com:9443/ws/ethbtc@depth20@1000ms";
         const ws = new WebSocket(streamUrl);
         commit("setLoading", true);

         ws.onopen = () => {
            console.log("WebSocket установлено соединение");
            commit("setLoading", false);
         };

         ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data) {
               const formattedBids = data.bids.map(([price, quantity]) => [
                  price,
                  quantity,
               ]);
               const formattedAsks = data.asks.map(([price, quantity]) => [
                  price,
                  quantity,
               ]);

               commit("setOrderBook", {
                  bids: formattedBids,
                  asks: formattedAsks,
               });
               commit("setSpread", {
                  bids: formattedBids,
                  asks: formattedAsks,
               });
               dispatch("getOurOrders");
            }
         };

         ws.onerror = (error) => {
            console.error("WebSocket ошибка:", error);
         };

         ws.onclose = () => {
            console.log("WebSocket закрыто соединение");
         };
      },
   },

   getters: {
      isOurOrder: (state) => (order) => {
         const orderPrice = Number(order[0]);
         const orderQuantity = Number(order[1]);

         return state.ourOrders.some((ourOrder) => {
            const ourOrderPrice = Number(ourOrder[0]);
            const ourOrderQuantity = Number(ourOrder[1]);

            return (
               orderPrice === ourOrderPrice &&
               orderQuantity === ourOrderQuantity
            );
         });
      },
   },
};

export default orderBook;
