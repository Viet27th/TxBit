import React, {useState, useRef, useEffect} from "react";
import styles from "./App.module.scss";
import axios from "axios";

// tradeType = 1 is buy, = 0 is sell
const App = () => {
  const [ticker, setTicker] = useState("NEXA");
  const [baseTicker, setBaseTicker] = useState("USDT");
  const [buyOrder, setBuyOrder] = useState([]);
  const [sellOrder, setSellOrder] = useState([]);

  const getBuyOrders = async () => {
    try {
      const response = await axios.post(`https://txbit.io/api/GetBuyOrders/${ticker}/${baseTicker}`);

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getSellOrders = async () => {
    try {
      const response = await axios.post(`https://txbit.io/api/GetSellOrders/${ticker}/${baseTicker}`);

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getNegotiate = async () => {
    const response = await axios.post(`https://live.txbit.io/ws/negotiate?ticker=${ticker}&baseTicker=${baseTicker}&negotiateVersion=1`);

    return {
      "connectionId": response.data.connectionId,
      "connectionToken": response.data.connectionToken,
      "negotiateVersion": response.data.negotiateVersion
    };
  };

  const socket = (connectionToken) => {
    const link = `wss://live.txbit.io/ws?ticker=${ticker}&baseTicker=${baseTicker}&id=${connectionToken}`;
  };

  useEffect(() => {
    (async () => {
      const buyOrder = await getBuyOrders();
      const sellOrder = await getSellOrders();
      setBuyOrder(buyOrder);
      setSellOrder(sellOrder.reverse());
    })();
  }, []);

  const onOkClicked = async () => {
    const buyOrder = await getBuyOrders();
    const sellOrder = await getSellOrders();
    setBuyOrder(buyOrder);
    setSellOrder(sellOrder.reverse());
  };

  return (
    <div className={styles["app"]}>
      <div className="container mt-3">
        <div className="mb-2">
          Nhập đồng coin cần xem:
          <input className="ms-2" type="text" value={ticker} onChange={(e) => setTicker(e.currentTarget.value.toUpperCase())} />
          <button type="button" onClick={onOkClicked}>Ok</button>
        </div>

        <div className="row">
          <div className="col-5">
            <div className="row bg-success py-2">
              <div className="col-3 text-white">Price {baseTicker}</div>
              <div className="col-3 text-white">Amount {ticker}</div>
              <div className="col-3 text-white">Amount {baseTicker}</div>
            </div>
            <div className={`${styles["buy-col"]}`}>
              {
                buyOrder.map((item, index) => {
                  return (
                    <div className="row" key={index}>
                      <div className="col-3">{item[0]}</div>
                      <div className="col-3">{item[1]}</div>
                      <div className="col-3">{item[2]}</div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div className="col-2"></div>

          <div className="col-5">
            <div className="row bg-danger py-2">
              <div className="col-3 text-white">Price {baseTicker}</div>
              <div className="col-3 text-white">Amount {ticker}</div>
              <div className="col-3 text-white">Amount {baseTicker}</div>
            </div>

            <div className={`${styles["sell-col"]}`}>
              {
                sellOrder.map((item, index) => {
                  return (
                    <div className="row" key={index}>
                      <div className="col-3">{item[0]}</div>
                      <div className="col-3">{item[1]}</div>
                      <div className="col-3">{item[2]}</div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;