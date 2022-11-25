import express from "express";
import compression from "compression";
import dotenv from 'dotenv'
dotenv.config()
// import { getOrders } from "./services/connect.js";
import {
  addBooking,
  addRoom,
  getRoomsForBooking,
  getBooking,
  getBookings,
  getBookingsOnTheDay,
  getCountsForDashboard,
  getRoom,
  getRoomCounts,
  getRooms,
  addRoomAvailability,
  getAllAddons,
  getRoomAvailability,
  getGuest,
  getUserData,
  addRoomAvailRef,
  getRoomAvailRefStatus,
  updateRoomAvailRefStatus,
  getUpdatedAvailRefs,
  // getTextValues,
  // uploadImage,
  getBookingForGuest,
  updateBooking,
  updateRoom,
  getUsers,
  deleteRoom,
  editRoom,
  getGuests,
  getGuestById,
  editRoomOwner,
  editGuest,
  
  
  search,
  // logInUser,
  // logOutUser,
  
  
  
  // addBookingOnWcCreate,
  AddNewAddon,
  editAddons,
  removeAddon,
  removeAddonFromBooking,
  addNewAddonForBooking,
  // exportTexts,
  addNewAdvance,
  removeAdvance,
} from "./services/database.js";
import { exportAsCsv } from "./services/FileHandle.js";
import {
  sendBookingAddedEmail,
  sendBookingUpdatedEmail,
  sendMail,
  sendRoomAvailUpdatedEmail,
} from "./services/mail.js";
import { getCheckInDate, getCheckOutDate } from "./services/wp_database.js";
import path from "path";
import { Readable } from "stream";
import bodyParser from "body-parser";
import mongoose  from "mongoose";
import multer from "multer";

const app = express();
// app.use(express.json());
// app.use(compression());

console.log(process.env.dbusername)
console.log(process.env.password)
console.log(process.env.database)


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// var port = process.env.PORT || 8000;

app.post("/getCountsForDashboard", async (req, res) => {
  try {
    const result = await getCountsForDashboard(req.body.date);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getRoomCounts", async (req, res) => {
  try {
    const result = await getRoomCounts();
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getBookingsOnTheDay", async (req, res) => {
  try {
    const result = await getBookingsOnTheDay(req.body.day);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getBooking", async (req, res) => {
  try {
    const result = await getBooking(req.body.id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getBookings", async (req, res) => {
  try {
    const result = await getBookings(req.body);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getBookingsForGuest", async (req, res) => {
  try {
    const result = await getBookingForGuest(req.body.guest_id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getRooms", async (req, res) => {
  try {
    const result = await getRooms(req.body);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getRoom", async (req, res) => {
  try {
    const result = await getRoom(req.body.id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getRoomAvailability", async (req, res) => {
  try {
    const result = await getRoomAvailability(req.body.room_id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getGuests", async (req, res) => {
  try {
    const result = await getGuests();
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getGuest", async (req, res) => {
  try {
    const result = await getGuest(req.body.email);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getGuestById", async (req, res) => {
  try {
    const result = await getGuestById(req.body.guest_id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getAddons", async (req, res) => {
  try {
    const result = await  getAllAddons();
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getAllAddons", async (req, res) => {
  try {
    const result = await  getAllAddons();
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getRoomsForBooking", async (req, res) => {
  try {
    const result = await getRoomsForBooking(req.body.dates);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getUserData", async (req, res) => {
  try {
    // const result = await getUserData();
    return res.status(200).send({
      success: true,
      // data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getUsers", async (req, res) => {
 try {
    const result = await getUsers();
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/addBooking", async (req, res) => {
  try {
    const result = await addBooking(req.body);
    await sendBookingAddedEmail(result);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/addRoom", async (req, res) => {
  try {
    const result = await addRoom(req.body);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/editRoom", async (req, res) => {
  try {
    const result = await editRoom(req.body);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/editRoomOwner", async (req, res) => {
  try {
    const result = await editRoomOwner(req.body);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/editGuest", async (req, res) => {
  try {
    const result = await editGuest(req.body);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/addRoomAvailability", async (req, res) => {
  try {
    const result = await addRoomAvailability(req.body);
    await sendRoomAvailUpdatedEmail(req.body.room_id, req.body.dates);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/addRoomAvailRef", async (req, res) => {
  try {
    const result = addRoomAvailRef(req.body.room_id, req.body.email);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getRoomAvailRefStatus", async (req, res) => {
  try {
    const result = await getRoomAvailRefStatus(req.body.ref_id);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/getUpdatedAvailRefs", async (req, res) => {
  try {
    const result = await getUpdatedAvailRefs();
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/updateRoomAvailRefStatus", async (req, res) => {
  try {
    const result = await updateRoomAvailRefStatus(
      req.body.ref_id,
      req.body.ref_status
    );
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/updateBooking", async (req, res) => {
  try {
    const result = await updateBooking(req.body);
    // await sendBookingAddedEmail(result);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

// app.post("/updateBookingAndNotify", async (req, res) => {
//   const updated = await updateBooking(req.body);
//   if (!updated) return res.status(503).send();
//   await sendBookingUpdatedEmail(req.body.booking_id);
//   res.status(200).send();
// });

app.post("/updateRoom", async (req, res) => {
  try {
    const result = await updateRoom(req.body);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/login", async (req, res) => {
  const isLoggedIn = true;
  // const isLoggedIn = await logInUser(req.body.username, req.body.pass);
  if (isLoggedIn === false) return res.status(503).send();
  return res.status(200).send({
    success: true,
    data: isLoggedIn
  });
});

app.post("/logout", async (req, res) => {
  // const isLoggedOut = await logOutUser();
  const isLoggedOut = true;
  if (isLoggedOut === false) return res.status(503).send();
  res.status(200).send();
});

app.post("/sendMail", async (req, res) => {
  try {
    const { email, ownerName, roomName, roomAddress, link } = req.body;
    const result = await sendMail(email, ownerName, roomName, roomAddress, link);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/search", async (req, res) => {
  try {
    const result = await search(req.body.table, req.body.query);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

// app.post("/getTextValues", async (req, res) => {
//   const data = await getTextValues(req.body.lan);
//   if (!data) return res.status(503).send();
//   res.status(200).send(data);
// });

// app.post("/uploadImage", async (req, res) => {
//   const isUploaded = await uploadImage(req.body.img, req.body.name);
//   if (isUploaded === false) return res.status(503).send();
//   res.status(200).send();
// });








// // Testing WC API

// app.post("/getWCOrders", async (req, res) => {
//   const data = await getOrders();
//   res.status(200).send(data);
// });

// app.post("/onWCOrderCreate", async (req, res) => {
//   // m$UN*DO%UIgw=5}kYNuldth$/!oKjiiqr!c&Pl,nIuJ~4lx.z*
//   let booking = req.body;
//   let isAdded = await addBookingOnWcCreate(booking);
//   if (isAdded === false) return res.status(503).send();
//   res.status(200).send();
// });

// app.post("/convertListToCsv", async (req, res) => {
//   await exportAsCsv(req.body.list);
//   res.status(200).send();
// });

// app.get("/downloadConvertedCsv", (req, res) => {
//   //   console.log(path.join(path.resolve() + "/tmp.csv"));
//   res.download(path.join(path.resolve() + "/tmp.csv"), (err) => {
//     if (err) console.log("err:", err);
//   });
// });

app.post("/addNewAddon", async (req, res) => {
  try {
    const result = await AddNewAddon(req.body);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/editAddons", async (req, res) => {
  try {
    const result = await editAddons(req.body.updatedAddons);
    return res.status(200).send(result);
  } catch (err) {
    return resaddon_id
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/removeAddon", async (req, res) => {
  try {
    const addon_id = req.body.addon_id;
    const result =  await removeAddon(addon_id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/removeAddonFromBooking", async (req, res) => {
  try {
    const { booking_id, addon_id } = req.body;
    const result = await removeAddonFromBooking(booking_id, addon_id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/addNewAddonForBooking", async (req, res) => {
  try {
    const { booking_id, addon_id, qty } = req.body;
    const result = await addNewAddonForBooking(booking_id, addon_id, qty);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

// app.post("/exportTexts", async (req, res) => {
//   const data = await exportTexts();
//   res.status(200).send(data);
// });

app.post("/addNewAdvance", async (req, res) => {
  try {
    const { booking_id, amount } = req.body
    const result = await addNewAdvance(booking_id, amount);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/removeAdvance", async (req, res) => {
  try {
    const { advance_id, booking_id } = req.body;
    const result = await removeAdvance(advance_id, booking_id);
    return res.status(200).send(result);
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

app.post("/deleteRoom", async (req, res) => {
  try {
    const result = await deleteRoom(req.body.room_id);
    return res.status(200).send({
      success: true,
      data: result
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: err
      });
  }
});

// var server = app.listen(port, () => {
//   console.log(`listening on port ` + port);
// });

//   [e^8hG_0i_{24A:mPF0Jjf^k61?dAKW98;#[G)h5l_#AO7k4o#

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    // `mongodb+srv://${'darshanajayarathna'}:${'todo11@'}@cluster0.vkkpm.mongodb.net/${'forum-db'}?retryWrites=true&w=majority`,
    `mongodb+srv://${process.env.dbusername}:${process.env.password}@cluster0.vkkpm.mongodb.net/${process.env.database}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then((result) => {
    console.log("connect")
    app.listen(process.env.PORT || 8080)
    // app.listen(8080);
  })
  .catch((err) => console.log(err));
