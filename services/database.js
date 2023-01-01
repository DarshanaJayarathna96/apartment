import { createConnection, createPool } from "mysql";
import { config } from "./config.js";
import CryptoJs from "crypto-js";
import fs from "fs";
import { getCheckInDate, getCheckOutDate } from "./wp_database.js";
// import Booking from "../models/booking.model";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import RoomOwner from "../models/roomOwner.model.js";
import Guest from "../models/guest.model.js";
import User from "../models/user.model.js";
import AddOn from "../models/addOn.model.js";
import AddOns from "../models/addOns.model.js";
import RoomAvailableRef from "../models/roomAvilableRef.model.js";
import RoomAvailability from "../models/roomAvalibility.model.js";
import BookingAdvance from "../models/bookingAdvance.model.js";
import BookingAddOn from "../models/bookingAddOn.model.js";
import moment from "moment";
// const Booking = require("../models/booking.model");

// const conn = createConnection(config);

// const decryptPass = async (pass) => {
//   var secKey = "Gam30fThr0n3s*_";
//   var bytes = CryptoJs.AES.decrypt(pass, secKey);
//   var originaltext = bytes.toString(CryptoJs.enc.Utf8);

//   return originaltext;
// };

// const formatDate = () => {
//   let now = new Date();
//   let y = now.getFullYear();
//   let m = now.getMonth() + 1;
//   let d = now.getDate();
//   return `${y}-${m}-${d}`;
// };

// const formatDate2 = () => {
//   let now = new Date();
//   let y = now.getFullYear();
//   let m = now.getMonth() + 1;
//   let d = now.getDate();
//   return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
// };

export const getCountsForDashboard = async (date) => {
  try {
    const from = new Date(date);
    const from1 = new Date(date);
    const to = new Date(from1.setDate(from.getDate() + 1));
    console.log(from)
    console.log(to)
    const noOfBookings = await Booking.find({booking_date: { $gte: from, $lt: to }}).countDocuments() || 0;
    const noOfCheckIns = await Booking.find({arrival: date}).countDocuments() || 0;
    const noOfCheckOuts = await Booking.find({departure: date}).countDocuments() || 0;
    const noOfAvailableRooms = await RoomAvailability.find({avail_date: date}).countDocuments() || 0;
    return { noOfBookings, noOfCheckIns, noOfCheckOuts, noOfAvailableRooms };
  } catch (err) {
    throw err;
  }
};

export const getRoomCounts = async () => {
  try {
    const noOfRooms = await Room.find().countDocuments() || 0;
    const noOfPendingRooms = await Booking.find({payment_status: "pending"}).countDocuments() || 0;
    const noOfBookedRooms = await Booking.find({payment_status: "booked"}).countDocuments() || 0;
    const noOfCancelledRooms = await Booking.find({payment_status: "cancelled"}).countDocuments() || 0;
    return { noOfRooms, noOfPendingRooms, noOfBookedRooms, noOfCancelledRooms}
  } catch (err) {
    throw err;
  }
};

export const getBookingsOnTheDay = async (day) => {
  try {
    // neet to return with guest
    return await Booking.find({arrival: day}).populate('room_id').populate('guest_id');
  } catch (err) {
    throw err;
  }
};

export const getBooking = async (id) => {
  try {
    const advance_amounts = await BookingAdvance.find({booking_id: id});
    const result = await Booking.findOne({ _id: id }).populate('room_id').populate('guest_id')
    .populate('addons').populate(
      { 
          path: 'addons',
          populate: {
              path: 'addon_id',
              model: 'AddOns'
          }
      }
  );
    if(advance_amounts.length > 0) {
      return {...result.toObject(), advance_amounts }
    }
    return result;
  } catch (err) {
    throw err;
  }
};

export const getBookings = async (status) => {
  try {
    if(status.query === "pending" || status.query === "booked" || status.query === "cancelled" || status.query === "refund") {
      return await Booking.find({payment_status: status.query}).populate('room_id').populate('guest_id');
    } else {
      return await Booking.find().populate('room_id').populate('guest_id');
    }
  } catch (err) {
    throw err;
  }
};

export const getBookingForGuest = async (guest_id) => {
  try {
    return await Booking.find({ guest_id });
  } catch (err) {
    throw err;
  }
};

export const getRooms = async (status) => {
  try {
    if(status.query === "active" || status.query === "inactive") {
      return await Room.find({status: status.query}).populate('roomAvailability_id').populate('bookingInfo');
    } else {
      return await Room.find().populate('roomAvailability_id').populate('bookingInfo');
    }
  } catch (err) {
    throw err;
  }
};

export const getRoom = async (id) => {
  try {
    const roomData =  await Room.findById(id);
    const roomOwnerData = await RoomOwner.findOne({room_id: id});
    // const roomOwnerData = {};
    return { ...roomData.toObject(), ...roomOwnerData.toObject()};
    // return roomData;
  } catch (err) {
    throw err;
  }
};

export const getRoomAvailability = async (id) => {
  try {
    return await RoomAvailability.findOne({ _id: id }) || {};
  } catch (err) {
    throw err;
  }
};

export const getGuest = async (email) => {
  try {
    return await Guest.findOne({ email }) || false;
  } catch (err) {
    throw err;
  }
};

export const getGuestById = async (id) => {
  try {
    console.log(id)
    return await Guest.findOne({ _id: id });
  } catch (err) {
    throw err;
  }
};

export const getGuests = async () => {
  try {
    return await Guest.find();
  } catch (err) {
    throw err;
  }
};

export const getRoomsForBooking = async (dates) => {
  try {
    const dateArray = [ ...new Set(dates)];
    const availabilityArray = await RoomAvailability.find({ avail_date: {$all: dateArray }});
    const availabilityIds =  availabilityArray.map(el => el._id);
    delete dateArray[1];
    let roomsArray = await Room.find({ "roomAvailability_id": {$in: availabilityIds }}).populate('bookingInfo');
    roomsArray = roomsArray.filter(el =>  el.bookingInfo.every(book => dateArray.every(date => date !== book.arrival)))
    
    return roomsArray;
  } catch (err) {
    throw err;
  }
};

export const getAllAddons = async () => {
  try {
    return await AddOns.find();
  } catch (err) {
    throw err;
  }
};

var generateBookingNo = async () => {
  let bkNo = "";
  let now = new Date();
  let y = now.getFullYear().toString().substring(2, 4);
  let m = now.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d = now.getDate();
  d = d < 10 ? "0" + d : d;
  bkNo = y + m + d;
  var generateRandNum = () => {
    let rand = Math.floor(Math.random() * 10);
    return rand;
  };
  for (let i = 0; i < 4; i++) {
    bkNo += generateRandNum();
  }
  return bkNo;
};

export const addBooking = async (json) => {
  const bookingNo = await generateBookingNo();
  const addOnArray = json.addons || [];
  try {
    delete json._id;
    // await Room.findByIdAndUpdate({ _id: json.room_id }, {
    //   $set: { bookingDetails: [{
    //     arrival: json.arrival,
    //     departure: json.departure,
    //     booking_status: 'booked',
    // }], booking_status: 'booked', arrival: json.arrival, departure: json.departure },
    // }, { new: true });
    const guestData = new Guest({first_name: json.first_name, last_name: json.last_name, email: json.email, phone_no: json.phone_no, address: json.address})
    await guestData.save();
    const data = {
      ...json,
      booking_no: bookingNo,
      balance: +json?.price - +json?.advance,
      guest_id: guestData._id
    };
    const bookingData = new Booking(data);
    const bookingDataResult = await bookingData.save();
    const bookingAdvance = new BookingAdvance({advance_amount: +json.advance, booking_id: bookingDataResult._id});
    await bookingAdvance.save();
    addOnArray.forEach(async (addon) => {
      const bookingAddOn = new BookingAddOn({ addon_id: addon._id, booking_id: bookingDataResult._id });
      await bookingAddOn.save();
    });

    return bookingDataResult;
  } catch (err) {
    throw err;
  }
};

export const addRoom = async (json) => {
  try {
    const availability = json.availability || [];
    const availabilityArray = [];

    var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
    let daylist = getDaysArray(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));

    daylist = daylist.map((v)=>{
      if(availability.length > 0) {
        const unavailabilityDate = availability.find(el => el === moment(v).format("yyyy-MM-DD"));
        if(!unavailabilityDate) {
          return availabilityArray.push(moment(v).format("yyyy-MM-DD"));
        }
      } else {
        return availabilityArray.push(moment(v).format("yyyy-MM-DD"));
      }
    });
    
    const roomAvailability = new RoomAvailability({avail_date: availabilityArray, room_name: json.room_name, room_address: json.address});
    await roomAvailability.save();
    const room = new Room({ ...json, roomAvailability_id: roomAvailability._id});
    const roomData = await room.save();
    const roomOwner = new RoomOwner({room_id: roomData._id, first_name: json.first_name, last_name: json.last_name, email: json.email, phone_no: json.phone_no, address: json.address})
    await roomOwner.save();
    return roomData;
  } catch (err) {
    throw err;
  }
};

export const addRoomAvailability = async ({ room_id, dates, rem_dates }) => {
  try {
    const room = await Room.findById(room_id);
    const availabilityId = room.roomAvailability_id;
    console.log("availabilityId");
    console.log(availabilityId);
    const availability = await RoomAvailability.findById(availabilityId);
    console.log("availability");
    console.log(availability);
    console.log("dates");
    console.log(dates);
    if(availability) {
      return await RoomAvailability.findByIdAndUpdate({ _id: availabilityId }, {
        $set: { avail_date: [...availability?.avail_date, ...dates] },
      }, { new: true });
    } else {
      return await RoomAvailability.findByIdAndUpdate({ _id: availabilityId }, {
        $set: { avail_date: dates },
      }, { new: true });
    }
    // await RoomAvailability.deleteOne({room_id});
    // const roomAvailability = new RoomAvailability({ room_id, avail_date: dates });
    // return await roomAvailability.save();
  } catch (err) {
    throw err;
  }
  // dates.forEach(async (date) => {
    // rem_dates value need to be delete
    // const roomAvailability = new RoomAvailability({ room_id, avail_date: dates });
    // await roomAvailability.save();
  // });
};

export const getUserData = async () => {
  try {
    return await User.find({logging_Status: 1});
  } catch (err) {
    throw err;
  }
};

// export const logInUser = async (username, password) => {
//   let reqStatus = await new Promise((resolve) => {
//     conn.query(
//       `SELECT user_password FROM user WHERE username='${username}'`,
//       async (err, result) => {
//         if (err) {
//           resolve(false);
//           throw err;
//         }
//         let rPass = await decryptPass(result[0].user_password);
//         let cPass = await decryptPass(password);
//         if (rPass === cPass) {
//           conn.query(
//             `UPDATE user SET logging_Status='${1}' WHERE username='${username}'`,
//             (err, result2) => {
//               if (err) {
//                 resolve(false);
//                 throw err;
//               }
//               resolve(true);
//             }
//           );
//         } else {
//           resolve(false);
//         }
//       }
//     );
//   });

//   return await reqStatus;
// };

// export const logOutUser = async () => {
//   let reqStatus = new Promise((resolve) => {
//     conn.query(
//       `UPDATE user SET logging_Status='${0}' WHERE logging_Status='${1}'`,
//       (err, result) => {
//         if (err) {
//           resolve(false);
//           throw err;
//         }
//         resolve(true);
//       }
//     );
//   });

//   return await reqStatus;
// };

export const addRoomAvailRef = async (room_id, email) => {
  const roomAvailableRef = new RoomAvailableRef({ref_status: "requested", room_id, email});
  try {
    return await roomAvailableRef.save();
  } catch (err) {
    throw err;
  }
};

export const getRoomAvailRefStatus = async (ref_id) => {
  try {
    return await RoomAvailableRef.find({_id: ref_id});
  } catch (err) {
    throw err;
  }
};

export const getUpdatedAvailRefs = async () => {
  try {
    return await RoomAvailableRef.find({ref_status: "updated"});
  } catch (err) {
    throw err;
  }
};

export const updateRoomAvailRefStatus = async (ref_id, ref_status) => {
  try {
    return await RoomAvailableRef.findByIdAndUpdate({ _id: ref_id}, {
      $set: ref_status,
    },
      { new: true });
  } catch (err) {
    throw err
  }
};

export const updateBooking = async (json) => {
  try {
    return await Booking.findByIdAndUpdate({ _id: json._id}, {
      $set: json,
    },
      { new: true });
  } catch (err) {
    throw err
  }
};

export const updateRoom = async (json) => {
  try {
    return await Room.findByIdAndUpdate({ _id: json.room_id}, {
      $set: json,
    },
      { new: true });
  } catch (err) {
    throw err
  }
};

export const search = async (table, query) => {
  try {
    // await RoomAvailability.deleteMany({});
    // await Room.deleteMany({});
    // await Booking.deleteMany({});
    // await Guest.deleteMany({});
    if(table === "room") {
      if(query.date) {
        if(query) {
          const availabilityArray = await RoomAvailability.find({ avail_date: query.date });
          const availabilityIds =  availabilityArray.map(el => el._id);
          return await Room.find({ "roomAvailability_id": {$in: availabilityIds }}).populate('bookingInfo')};
      } else {
        let rooms = await Room.find().populate('roomAvailability_id');
          if(query){
            if(query?.length > 0) {
              rooms = rooms.filter(x=>
                  x.room_name.toLowerCase().includes(query.toLowerCase()))
            } else {
              return rooms;
            }
          } else {
            return rooms;
          }
          return rooms;
      }
    } else {
      if(query.date) {
        const from = new Date(query.date);
        const from1 = new Date(query.date);
        const to = new Date(from1.setDate(from.getDate() + 1));
        let bookings = await Booking.find({booking_date: { $gte: from, $lt: to }}).populate('room_id').populate('guest_id');
        return bookings;
      } else {
        let bookings = await Booking.find().populate('room_id').populate('guest_id');
        if(query){
          if(query?.length > 0) {
            bookings = bookings.filter(x=>
                x.room_id.room_name.toLowerCase().includes(query.toLowerCase())
                || x.guest_id.first_name.toLowerCase().includes(query.toLowerCase())
                || x.guest_id.last_name.toLowerCase().includes(query.toLowerCase()))
          } else {
            return bookings;
          }
        } else {
          return bookings;
        }
        return bookings;
      }
    }
  } catch (err) {
    throw err
  }

  // let roomQuery = (q) => {
  //   return `SELECT * FROM room WHERE room_name LIKE '%${q}%' OR price LIKE '%${q}%' OR room_type LIKE '%${q}%' OR address LIKE '%${q}%' OR added_date LIKE '%${q}%' OR booking_status LIKE '%${q}%' OR status LIKE '%${q}%' OR email LIKE '%${q}%'`;
  // };

  // let bookingQuery = (q) => {
  //   let parsedquery = Date.parse(q);
  //   if (parsedquery) {
  //     parsedquery = new Date(parsedquery);
  //     let y = parsedquery.getFullYear();
  //     let m = parsedquery.getMonth() + 1;
  //     let d = parsedquery.getDate();

  //     let date = `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
  //     return `SELECT * FROM booking,guest WHERE booking.guest_id=guest.guest_id AND (arrival LIKE '%${date}%' OR departure LIKE '%${date}%' OR booking_date LIKE '%${date}%')`;
  //   }
  //   parsedquery = q.split("/");
  //   if (parsedquery.length === 3) {
  //     let newDate = new Date(
  //       `${parsedquery[1]}-${parsedquery[0]}-${parsedquery[2]}`
  //     );

  //     let y = newDate.getFullYear();
  //     let m = newDate.getMonth() + 1;
  //     let d = newDate.getDate();

  //     let date = `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;

  //     return `SELECT * FROM booking,guest WHERE booking.guest_id=guest.guest_id AND (arrival LIKE '%${date}%' OR departure LIKE '%${date}%' OR booking_date LIKE '%${date}%')`;
  //   }
  //   parsedquery = q.split("-");
  //   if (parsedquery.length === 3) {
  //     let newDate = new Date(
  //       `${parsedquery[1]}-${parsedquery[0]}-${parsedquery[2]}`
  //     );

  //     let y = newDate.getFullYear();
  //     let m = newDate.getMonth() + 1;
  //     let d = newDate.getDate();

  //     let date = `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;

  //     return `SELECT * FROM booking,guest WHERE booking.guest_id=guest.guest_id AND (arrival LIKE '%${date}%' OR departure LIKE '%${date}%' OR booking_date LIKE '%${date}%')`;
  //   }
  //   parsedquery = q.split(" ");
  //   if (parsedquery.length === 2) {
  //     return `SELECT * FROM booking,guest WHERE booking.guest_id=guest.guest_id AND (arrival LIKE '%${q}%' OR departure LIKE '%${q}%' OR price LIKE '%${q}%' OR payment_method LIKE '%${q}%' OR payment_status LIKE '%${q}%' OR booking_date LIKE '%${q}%' OR note LIKE '%${q}%' OR booking_no LIKE "%${q}%" OR  first_name LIKE '%${parsedquery[0]}%' OR last_name LIKE '%${parsedquery[1]}%' OR address LIKE '%${q}%' OR email LIKE '%${q}%' OR phone_no LIKE '%${q}%')`;
  //   }
  //   return `SELECT * FROM booking,guest WHERE booking.guest_id=guest.guest_id AND (booking_no LIKE '%${q}%' OR arrival LIKE '%${q}%' OR departure LIKE '%${q}%' OR price LIKE '%${q}%' OR payment_method LIKE '%${q}%' OR payment_status LIKE '%${q}%' OR booking_date LIKE '%${q}%' OR note LIKE '%${q}%' OR first_name LIKE '%${q}%' OR last_name LIKE '%${q}%' OR address LIKE '%${q}%' OR email LIKE '%${q}%' OR phone_no LIKE '%${q}%')`;
  // };

  let guestQuery = (q) => {
    let queryList = q.split(" ");
    if (queryList.length > 1) {
      return `SELECT * FROM guest WHERE first_name LIKE '%${queryList[0]}%' OR last_name LIKE '%${queryList[1]}%' OR address LIKE '%${q}%' OR email LIKE '%${q}%' OR phone_no LIKE '%${q}%'`;
    }
    return `SELECT * FROM guest WHERE first_name LIKE '%${q}%' OR last_name LIKE '%${q}%' OR address LIKE '%${q}%' OR email LIKE '%${q}%' OR phone_no LIKE '%${q}%'`;
  };

  let data = new Promise((resolve) => {
    if (table === "all") {
      let sResults = {};
      conn.query(roomQuery(query), (err, res) => {
        if (err) throw err;
        sResults = { ...sResults, rooms: res };
        conn.query(bookingQuery(query), (err, res) => {
          if (err) throw err;
          sResults = { ...sResults, bookings: res };
          conn.query(guestQuery(query), (err, res) => {
            if (err) throw err;
            sResults = { ...sResults, guests: res };
            resolve(sResults);
          });
        });
      });
    } else if (table === "room") {
      conn.query(roomQuery(query), (err, res) => {
        if (err) throw err;
        resolve(res);
      });
    } else if (table === "booking") {
      conn.query(bookingQuery(query), (err, res) => {
        if (err) throw err;
        resolve(res);
      });
    } else if (table === "guest") {
      conn.query(guestQuery(query), (err, res) => {
        if (err) throw err;
        resolve(res);
      });
    }
  });

  return await data;
};

// export const getTextValues = async (lan) => {
//   let data = new Promise((resolve) => {
//     let tv = {};

//     conn.query(
//       `SELECT text_name,text_value FROM language WHERE text_lan='${lan}'`,
//       (err, result) => {
//         if (err) {
//           resolve(null);
//           throw err;
//         }
//         result.forEach((txt, index) => {
//           // console.log(txt.text_name, "-", txt.text_value);
//           tv = { ...tv, [txt.text_name]: txt.text_value };
//           if (index === result.length - 1) {
//             resolve(tv);
//           }
//         });
//       }
//     );
//   });

//   return await data;
// };

// export const uploadImage = async (img, name) => {
//   let isUploaded = new Promise((resolve) => {
//     fs.copyFile(
//       img,
//       `https://admin.resagrouponline.net/public_html/imgs/${name}.png`,
//       (err) => {
//         if (err) {
//           resolve(false);
//           throw err;
//         }
//         resolve(true);
//       }
//     );
//   });

//   return await isUploaded;
// };

// export const addBookingOnWcCreate = async (booking) => {
//   let checkInDate = await getCheckInDate(parseInt(booking.id) + 1);
//   let checkOutDate = await getCheckOutDate(parseInt(booking.id) + 1);

//   let firstName = booking.billing.first_name;
//   let lastName = booking.billing.last_name;
//   let address = booking.billing.address_1;
//   let city = booking.billing.city;
//   let postcode = booking.billing.postcode;
//   let country = booking.billing.country;
//   address = address + "," + city + "," + postcode + "," + country;
//   let email = booking.billing.email;
//   let phoneNo = booking.billing.phone;

//   let paymentStatus = "pending";
//   let paymentMethod = "pay on arrival";

//   let roomName = booking.line_items[0].name;

//   let note = booking.customer_note;

//   let priceData = new Promise((resolve) => {
//     let total = 0;
//     booking.line_items.forEach((item, index) => {
//       total += Number(item.total);
//       if (index === booking.line_items.length - 1) resolve(total);
//     });
//   });
//   let price = await priceData;
//   //   console.log("price: ", price);

//   let addonsData = new Promise((resolve) => {
//     let addons = booking.line_items.filter((item, index) => {
//       if (index !== 0) return item;
//     });
//     resolve(addons);
//   });

//   let addons = await addonsData;
//   //   console.log("addons: ", addons);

//   let getRoomId = new Promise((resolve) => {
//     conn.query(
//       `SELECT * FROM room WHERE room_name='${roomName}'`,
//       (err, result) => {
//         if (err) {
//           resolve(null);
//           throw err;
//         }
//         if (result.length > 0) {
//           resolve(result[0].room_id);
//         } else {
//           conn.query(
//             `INSERT INTO room(room_name) VALUES('${roomName}')`,
//             (err, addRommResult) => {
//               if (err) {
//                 resolve(null);
//                 throw err;
//               }
//               resolve(addRommResult.insertId);
//             }
//           );
//         }
//       }
//     );
//   });

//   let roomId = await getRoomId;
//   //   console.log("roomId: ", roomId);
//   if (!roomId) return null;

//   let getAddons = new Promise((resolve) => {
//     if (addons.length > 0) {
//       let x_addons = [];
//       addons.forEach((addon, index) => {
//         conn.query(
//           `SELECT * FROM addon WHERE addon_value='${addon.name}'`,
//           (err, result) => {
//             if (err) {
//               resolve(null);
//               throw err;
//             }
//             if (result.length > 0) {
//               let addon_id = result[0].addon_id;
//               x_addons.push({ ...addon, addon_id });
//             } else {
//               conn.query(
//                 `INSERT INTO addon(addon_value,price) VALUES('${addon.name}', '${addon.subtotal}')`,
//                 (err, addAddonResult) => {
//                   if (err) {
//                     resolve(null);
//                     throw err;
//                   }
//                   let addon_id = addAddonResult.insertId;
//                   x_addons.push({ ...addon, addon_id });
//                 }
//               );
//             }
//           }
//         );
//         if (addons.length - 1 === index) {
//           resolve(x_addons);
//         }
//       });
//     } else {
//       resolve("no-addons");
//     }
//   });

//   let newAddons = await getAddons;
//   //   console.log("newAddons: ", newAddons);
//   if (!newAddons) return null;

//   let setBooking = new Promise(async (resolve) => {
//     let bookingAdded = await addBooking({
//       arrival: checkInDate,
//       departure: checkOutDate,
//       no_of_adults: 0,
//       no_of_children: 0,
//       room_id: roomId,
//       addons: newAddons === "no-addons" ? [] : newAddons,
//       price: price,
//       first_name: firstName,
//       last_name: lastName,
//       email: email,
//       phone_no: phoneNo,
//       address: address,
//       note: note,
//       payment_method: paymentMethod,
//       payment_status: paymentStatus,
//       wp_booking: 1,
//       note: booking.id,
//     });
//     resolve(bookingAdded);
//   });

//   return await setBooking;
// };

export const AddNewAddon = async ({ addon_value, price }) => {
  try {
    const addOns =  new AddOns({ addon_value, price });
    return await addOns.save();
  } catch (err) {
    throw err
  }
};

export const editAddons = async (updatedAddons) => {
  try {
    return updatedAddons.forEach(async el => {
      await AddOns.findByIdAndUpdate({ _id: el._id}, {
        $set: el,
      },
        { new: true });
    })
  } catch (err) {
    throw err
  }
};

export const removeAddon = async (addon_id) => {
  try {
    return await AddOns.deleteOne({_id: addon_id});
  } catch (err) {
    throw err
  }
};

export const getUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw err;
  }
};

// export const exportTexts = async () => {
//   let data = new Promise((resolve) => {
//     conn.query(`SELECT * FROM language`, (err, result) => {
//       if (err) throw err;
//       resolve(result);
//     });
//   });

//   return await data;
// };

export const addNewAdvance = async (booking_id, amount) => {
  try {
  console.log(booking_id, amount);
   const bookingAdvance = new BookingAdvance({booking_id, advance_amount: amount});
   await bookingAdvance.save();
   const book = await Booking.findById(booking_id)
   const balance = book.balance - +amount;
   await Booking.findByIdAndUpdate({ _id: booking_id }, {
    $set: { balance },
  }, { new: true });
  const advances = await BookingAdvance.find({booking_id});
  return {...book, advance_amounts: advances, balance}
  } catch (err) {
    throw err;
  }
  // let data = new Promise((resolve) => {
  //   conn.query(
     
  //       conn.query(
  //         `SELECT advance_amount FROM booking_advance WHERE booking_id='${booking_id}'`,
  //         async (err, result) => {
  //           if (err) throw err;
  //           if (result && result.length > 0) {
  //             let ta = new Promise((resolve) => {
  //               let a = 0;
  //               result.forEach((row, index) => {
  //                 a += Number(row.advance_amount);
  //                 if (index === result.length - 1) {
  //                   resolve(a);
  //                 }
  //               });
  //             });
  //             let totalAdvance = await ta;
  //             conn.query(
  //               `SELECT price FROM booking WHERE booking_id='${booking_id}'`,
  //               (err, result) => {
  //                 if (err) throw err;
  //                 let p = result[0].price;
  //                 let nb = Number(p) - totalAdvance;
  //                 conn.query(
  //                   `UPDATE booking SET balance='${nb}' WHERE booking_id='${booking_id}'`,
  //                   (err, result) => {
  //                     if (err) throw err;
  //                     resolve(result);
  //                   }
  //                 );
  //               }
  //             );
  //           }
  //         }
  //       );
  //     }
  //   );
  // });

  // return await data;
};

export const removeAdvance = async (advance_id, booking_id) => {
  try {
      const advance = await BookingAdvance.findById(advance_id)
     await BookingAdvance.deleteOne({ _id: advance_id });
     const book = await Booking.findById(booking_id);
     const balance = +book.balance + +advance.advance_amount;
     return await Booking.findByIdAndUpdate({ _id: booking_id }, {
      $set: { balance },
    }, { new: true });
    } catch (err) {
      throw err;
    }
  // let data = new Promise((resolve) => {
  //   conn.query(
  //     `DELETE FROM booking_advance WHERE advance_id='${advance_id}'`,
  //     (err, result) => {
  //       if (err) {
  //         resolve(null);
  //         throw err;
  //       }
  //       conn.query(
  //         `SELECT advance_amount FROM booking_advance WHERE booking_id='${booking_id}'`,
  //         async (err, result) => {
  //           if (err) throw err;
  //           if (result && result.length > 0) {
  //             let ta = new Promise((resolve) => {
  //               let a = 0;
  //               result.forEach((row, index) => {
  //                 a += Number(row.advance_amount);
  //                 if (index === result.length - 1) {
  //                   resolve(a);
  //                 }
  //               });
  //             });
  //             let totalAdvance = await ta;
  //             conn.query(
  //               `SELECT price FROM booking WHERE booking_id='${booking_id}'`,
  //               (err, result) => {
  //                 if (err) throw err;
  //                 let p = result[0].price;
  //                 let nb = Number(p) - totalAdvance;
  //                 conn.query(
  //                   `UPDATE booking SET balance='${nb}' WHERE booking_id='${booking_id}'`,
  //                   (err, result) => {
  //                     if (err) throw err;
  //                     resolve(result);
  //                   }
  //                 );
  //               }
  //             );
  //           } else {
  //             conn.query(
  //               `SELECT price FROM booking WHERE booking_id='${booking_id}'`,
  //               (err, result) => {
  //                 if (err) throw err;
  //                 let p = result[0].price;
  //                 let nb = p;
  //                 conn.query(
  //                   `UPDATE booking SET balance='${nb}' WHERE booking_id='${booking_id}'`,
  //                   (err, result) => {
  //                     if (err) throw err;
  //                     resolve(result);
  //                   }
  //                 );
  //               }
  //             );
  //           }
  //         }
  //       );
  //     }
  //   );
  // });

  // return await data;
};

export const removeAddonFromBooking = async (booking_id, addon_id) => {
  try {
    const bookingAddon = await BookingAddOn.findOne({ $and: [ { addon_id }, { booking_id } ]});
    const result = await BookingAddOn.deleteOne({ $and: [ { addon_id }, { booking_id } ]});
    const addOn = await AddOns.findById(addon_id)
    await Booking.findByIdAndUpdate({ _id: booking_id }, {
      $inc: { price: -(+addOn.price * +bookingAddon.qty) },
    }, { new: true });
    return result;
  } catch (err) {
    throw err
  }
};

export const addNewAddonForBooking = async (booking_id, addon_id, qty = 1) => {
  try {
    const quantity = qty === "" ? 1 :  qty;
    const bookingAddOn = new BookingAddOn({ addon_id:addon_id, booking_id: booking_id, qty: +qty });
    const addOn = await AddOns.findById(addon_id);
    await Booking.findByIdAndUpdate({ _id: booking_id }, {
      $inc: { price: +(+addOn.price * +quantity) },
    }, { new: true });
    return await bookingAddOn.save();
  } catch (err) {
    throw err
  }
};

export const deleteRoom = async (id) => {
  try {
    const book = await Booking.findOne({room_id: id});
    console.log(book);
    console.log(id);
    if(!book) {
      console.log(11111111111)
      return await Room.deleteOne({ _id: id});
    } else {
      return true;
    }
  } catch (err) {
    throw err
  }
};

export const editRoom = async (json) => {
  try {
    console.log(json);
    delete json._id;
    return await Room.findOneAndUpdate({ _id: json.room_id}, {
      $set: json,
    },
      { new: true });
  } catch (err) {
    throw err
  }
};

export const editRoomOwner = async (json) => {
  const room_id = json._id
  delete json._id;
  const roomData = new RoomOwner(json);
  try {
    await RoomOwner.deleteOne({room_id: json.room_id});
    return await roomData.save();
  } catch (err) {
    throw err;
  }
};

export const editGuest = async (json) => {
  try {
    return await Guest.findByIdAndUpdate({ _id: json._id}, {
      $set: json,
    },
      { new: true });
  } catch (err) {
    throw err
  }
};
