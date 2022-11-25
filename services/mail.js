import nodemailer from "nodemailer";
import {
  getBooking,
  getGuestById,
  getRoom,
  getRoomAvailability,
} from "./database.js";

export const formatDateForTables = (day) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date(day);
  let d = date.getDate();
  let y = date.getFullYear();
  let m = months[date.getMonth()];
  let wd = weekdays[date.getDay()];

  return `${wd}, ${d < 10 ? `0${d}` : d} ${m}, ${y}`;
};

const transporterData = {
  host: "srv.resagrouponline.net",
  auth: {
    user: "booking@appartementvars.fr",
    pass: "JiUC5yGRgBwf",
  },
};

export const sendMail = async (
  ownerEmail,
  ownerName,
  roomName,
  roomAddress,
  link
) => {
  let response = new Promise(async (resolve) => {
    let transporter = nodemailer.createTransport(transporterData);

    var mailOptions = {
      from: "booking@appartementvars.fr",
      to: ownerEmail,
      subject: "Check Room Availability",
      html: `<h3>Dear ${ownerName},</h3> Please use the following link to update the availability of your property <b>${roomName}</b> located at <b>${roomAddress}</b>.<p> <a href="${link}">Click here</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        console.log(`email sent : ` + info.response);
        resolve(info.response);
      }
    });
  });

  return await response;
};

export const sendBookingAddedEmail = async (bookingId) => {
  const bookingData = await getBooking(bookingId);
  const {
    room_id,
    room_name,
    room_type,
    no_of_adults,
    no_of_children,
    price,
    advance_amounts,
    arrival,
    departure,
    booking_date,
    payment_method,
    payment_status,
    note,
    guest_id,
    booking_no,
  } = bookingData;
  const roomData = await getRoom(room_id);
  const guestData = await getGuestById(guest_id);

  let advance = 0;
  if (advance_amounts) {
    advance_amounts.forEach((row) => {
      advance += Number(row.advance_amount);
    });
  }

  let response = new Promise(async (resolve) => {
    let transporter = nodemailer.createTransport(transporterData);

    var mailOptions = {
      from: "booking@appartementvars.fr",
      to: guestData.email,
      subject: "New Booking Added",
      html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      body {
        background: rgb(221, 223, 225);
      }

      .booking-data-container {
        width: 60%;
        margin: 1em auto;
        background: #fff;
        border: 2px solid #1e51dc;
		text-transform: capitalize;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }

      h2,
      h3 {
        background: #1e51dc;
        color: white;
        margin: 0;
        padding: 1em;
        font-weight: 400;
        font-size: 1.2rem;
      }

      h3 {
        padding: 0.5em 1em;
        font-size: 0.8rem;
      }

      .main-data,
      .sub-data {
        display: grid;
        grid-template-columns: auto auto;
        flex-wrap: wrap;
      }

      .main-item-container,
      .sub-item-container {
        padding: 1em;
        color: rgb(135, 135, 135);
        padding-left: 2em;
        border-bottom: 1px solid rgb(221, 223, 225);
        border-right: 1px solid rgb(221, 223, 225);
      }

      .main-label,
      .sub-label {
        font-weight: 300;
        font-size: 0.8rem;
      }

      .sub-data {
        grid-template-columns: auto auto auto;
      }

      .main-item {
        font-weight: 600;
        font-size: 1rem;
      }

      .sub-item {
        font-weight: 600;
        font-size: 1rem;
      }
    </style>
  </head>
  <body>
    <p>
      Dear ${
        guestData.first_name + " " + guestData.last_name
      }, your have successfully made a booking with
      <a href="https://appartementvars.fr/">appartementvars.fr</a>. You can see
      your booking details below.
    </p>
    <div class="booking-data-container">
      <h2>booking/#${booking_no}</h2>
      <div class="main-data">
        <div class="main-item-container">
          <div class="main-label">Name</div>
          <div class="main-item">${
            guestData.first_name + " " + guestData.last_name
          }</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">arrival</div>
          <div class="main-item">${formatDateForTables(arrival)}</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">departure</div>
          <div class="main-item">${formatDateForTables(departure)}</div>
        </div>

		<div class="main-item-container">
          <div class="main-label">booking date</div>
          <div class="main-item">${formatDateForTables(booking_date)}</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">status</div>
          <div class="main-item">${payment_status}</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">persons</div>
          <div class="main-item">${no_of_adults + no_of_children}</div>
        </div>
      </div>
      <div class="data-container">
        <h3>room information</h3>

        <div class="sub-data">
          <div class="sub-item-container">
            <div class="sub-label">room id</div>
            <div class="sub-item">ROOM-${room_id}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">room name</div>
            <div class="sub-item">${room_name}</div>
          </div>

		  <div class="sub-item-container">
            <div class="sub-label">room type</div>
            <div class="sub-item">${room_type}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">room address</div>
            <div class="sub-item">${roomData.address}</div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <h3>guest information</h3>

        <div class="sub-data">
          <div class="sub-item-container">
            <div class="sub-label">name</div>
            <div class="sub-item">${
              guestData.first_name + " " + guestData.last_name
            }</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">address</div>
            <div class="sub-item">${guestData.address}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">email</div>
            <div class="sub-item">${guestData.email}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">phone no</div>
            <div class="sub-item">${guestData.phone_no}</div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <h3>payment information</h3>

        <div class="sub-data">
          <div class="sub-item-container">
            <div class="sub-label">total</div>
            <div class="sub-item">${Number(price).toFixed(2)} &euro;</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">advance payment</div>
            <div class="sub-item">${
              advance ? Number(advance).toFixed(2) : 0.0
            } &euro;</div>
          </div>

		  <div class="sub-item-container">
            <div class="sub-label">balance</div>
            <div class="sub-item">${(Number(price) - advance).toFixed(
              2
            )} &euro;</div>
          </div>


          <div class="sub-item-container">
            <div class="sub-label">payment method</div>
            <div class="sub-item">${payment_method}</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        console.log(`email sent : ` + info.response);
        resolve(info.response);
      }
    });
  });

  return await response;
};

export const sendBookingUpdatedEmail = async (bookingId) => {
  const bookingData = await getBooking(bookingId);
  const {
    room_id,
    room_name,
    room_type,
    no_of_adults,
    no_of_children,
    price,
    advance_amounts,
    arrival,
    departure,
    booking_date,
    payment_method,
    payment_status,
    note,
    guest_id,
    booking_no,
  } = bookingData;
  const roomData = await getRoom(room_id);
  const guestData = await getGuestById(guest_id);

  let advance = 0;
  if (advance_amounts) {
    advance_amounts.forEach((row) => {
      advance += Number(row.advance_amount);
    });
  }

  let response = new Promise(async (resolve) => {
    let transporter = nodemailer.createTransport(transporterData);

    var mailOptions = {
      from: "booking@appartementvars.fr",
      to: guestData.email,
      subject: "Booking Updated",
      html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      body {
        background: rgb(221, 223, 225);
      }

      .booking-data-container {
        width: 60%;
        margin: 1em auto;
        background: #fff;
        border: 2px solid #1e51dc;
		text-transform: capitalize;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }

      h2,
      h3 {
        background: #1e51dc;
        color: white;
        margin: 0;
        padding: 1em;
        font-weight: 400;
        font-size: 1.2rem;
      }

      h3 {
        padding: 0.5em 1em;
        font-size: 0.8rem;
      }

      .main-data,
      .sub-data {
        display: grid;
        grid-template-columns: auto auto;
        flex-wrap: wrap;
      }

      .main-item-container,
      .sub-item-container {
        padding: 1em;
        color: rgb(135, 135, 135);
        padding-left: 2em;
        border-bottom: 1px solid rgb(221, 223, 225);
        border-right: 1px solid rgb(221, 223, 225);
      }

      .main-label,
      .sub-label {
        font-weight: 300;
        font-size: 0.8rem;
      }

      .sub-data {
        grid-template-columns: auto auto auto;
      }

      .main-item {
        font-weight: 600;
        font-size: 1rem;
      }

      .sub-item {
        font-weight: 600;
        font-size: 1rem;
      }
    </style>
  </head>
  <body>
    <p>
      Dear ${
        guestData.first_name + " " + guestData.last_name
      }, your booking with booking number ${booking_no} has been updated. You can check the changes below.
    </p>
    <div class="booking-data-container">
      <h2>booking/#${booking_no}</h2>
      <div class="main-data">
        <div class="main-item-container">
          <div class="main-label">Name</div>
          <div class="main-item">${
            guestData.first_name + " " + guestData.last_name
          }</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">arrival</div>
          <div class="main-item">${formatDateForTables(arrival)}</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">departure</div>
          <div class="main-item">${formatDateForTables(departure)}</div>
        </div>

		<div class="main-item-container">
          <div class="main-label">booking date</div>
          <div class="main-item">${formatDateForTables(booking_date)}</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">status</div>
          <div class="main-item">${payment_status}</div>
        </div>

        <div class="main-item-container">
          <div class="main-label">persons</div>
          <div class="main-item">${no_of_adults + no_of_children}</div>
        </div>
      </div>
      <div class="data-container">
        <h3>room information</h3>

        <div class="sub-data">
          <div class="sub-item-container">
            <div class="sub-label">room id</div>
            <div class="sub-item">ROOM-${room_id}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">room name</div>
            <div class="sub-item">${room_name}</div>
          </div>

		  <div class="sub-item-container">
            <div class="sub-label">room type</div>
            <div class="sub-item">${room_type}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">room address</div>
            <div class="sub-item">${roomData.address}</div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <h3>guest information</h3>

        <div class="sub-data">
          <div class="sub-item-container">
            <div class="sub-label">name</div>
            <div class="sub-item">${
              guestData.first_name + " " + guestData.last_name
            }</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">address</div>
            <div class="sub-item">${guestData.address}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">email</div>
            <div class="sub-item">${guestData.email}</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">phone no</div>
            <div class="sub-item">${guestData.phone_no}</div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <h3>payment information</h3>

         <div class="sub-data">
          <div class="sub-item-container">
            <div class="sub-label">total</div>
            <div class="sub-item">${Number(price).toFixed(2)} &euro;</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">advance payment</div>
            <div class="sub-item">${
              advance ? Number(advance).toFixed(2) : 0.0
            } &euro;</div>
          </div>

		   <div class="sub-item-container">
            <div class="sub-label">balance</div>
            <div class="sub-item">${(Number(price) - advance).toFixed(
              2
            )} &euro;</div>
          </div>

          <div class="sub-item-container">
            <div class="sub-label">payment method</div>
            <div class="sub-item">${payment_method}</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        console.log(`email sent : ` + info.response);
        resolve(info.response);
      }
    });
  });

  return await response;
};

export const sendRoomAvailUpdatedEmail = async (roomId, roomAvailDates) => {
  const roomData = await getRoom(roomId);
  //   const roomAvailDates = await getRoomAvailability(roomId);

  let response = new Promise((resolve) => {
    let transporter = nodemailer.createTransport(transporterData);

    var mailOptions = {
      from: "booking@appartementvars.fr",
      to: roomData.email,
      subject: "Room Availability Updated",
      text: `Hello, availability of your room ${
        roomData.room_name
      } located at ${
        roomData.address
      } has been updated. New available dates are, \n\n ${roomAvailDates.join(
        "\n"
      )}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        console.log(`email sent : ` + info.response);
        resolve(info.response);
      }
    });
  });

  return await response;
};
