import { createConnection } from "mysql";
import { wpconfig } from "./config.js";

const initDb = () => {
  const conn = createConnection(wpconfig);
  return conn;
};

export const getCheckInDate = async (order_id) => {
  let data = new Promise((resolve) => {
    const conn = initDb();
    conn.connect((err) => {
      if (err) {
        resolve(null);
        throw err;
      }
      conn.query(
        `SELECT boi.order_id, boim.meta_value FROM thLPahoBhotel_booking_order_itemmeta boim, thLPahoBhotel_booking_order_items boi WHERE meta_key="check_in_date" AND boi.order_item_id = boim.hotel_booking_order_item_id AND boi.order_id=${order_id} GROUP BY boi.order_id`,
        (err, result) => {
          if (err) {
            resolve(null);
            throw err;
          }
          var date = new Date(Number(result[0].meta_value) * 1000);
          let d = date.getDate();
          let m = date.getMonth() + 1;
          let y = date.getFullYear();
          date = `${y}-${m}-${d}`;
          resolve(date);
        }
      );
    });
  });

  return await data;
};

export const getCheckOutDate = async (order_id) => {
  let data = new Promise((resolve) => {
    const conn = initDb();
    conn.connect((err) => {
      if (err) {
        resolve(null);
        throw err;
      }
      conn.query(
        `SELECT boim.meta_value FROM thLPahoBhotel_booking_order_itemmeta boim, thLPahoBhotel_booking_order_items boi WHERE meta_key="check_out_date" AND boi.order_item_id = boim.hotel_booking_order_item_id AND boi.order_id=${order_id}`,
        (err, result) => {
          if (err) {
            resolve(null);
            throw err;
          }
          var date = new Date(Number(result[0].meta_value) * 1000);
          let d = date.getDate();
          let m = date.getMonth() + 1;
          let y = date.getFullYear();
          date = `${y}-${m}-${d}`;
          resolve(date);
        }
      );
    });
  });

  return await data;
};
