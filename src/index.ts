// Importing necessary modules from the 'azle' library and 'uuid' library
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, Principal } from 'azle';
import { v4 as uuidv4 } from "uuid";

// Defining record types for different entities
type Hotel = Record<{
  id: string;
  name: string;
  owner: Principal;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type Room = Record<{
  id: string;
  room_number: string;
  is_booked: boolean;
  price: string;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type Reservation = Record<{
  id: string;
  room_id: string;
  guest: Principal;
  check_in_date: nat64;
  check_out_date: nat64;
  created_date: nat64;
}>;

type Payment = Record<{
  id: string;
  reservation_id: string;
  amount: string;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type RoomPayload = Record<{
  room_number: string;
  price: string;
}>;

type ReservationPayload = Record<{
  room_id: string;
  check_in_date: nat64;
  check_out_date: nat64;
}>;

type PaymentPayload = Record<{
  reservation_id: string;
  amount: string;
}>;

type PaymentResponse = Record<{
  msg: string;
  amount: number;
}>;

// Creating instances of StableBTreeMap for each entity type
const hotelStorage = new StableBTreeMap<string, Hotel>(0, 44, 512);
const roomStorage = new StableBTreeMap<string, Room>(1, 44, 512);
const reservationStorage = new StableBTreeMap<string, Reservation>(2, 44, 512);
const paymentStorage = new StableBTreeMap<string, Payment>(3, 44, 512);

// Initialization of hotelStorage
$update;
export function initHotel(name: string): string {
  if (!hotelStorage.isEmpty()) {
    return `Hotel has already been initialized`;
  }
  const hotel = {
    id: uuidv4(),
    name: name,
    owner: ic.caller(),
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  hotelStorage.insert(hotel.id, hotel);
  return hotel.id;
}

$query;
// Function to get available rooms
export function getAvailableRooms(): Result<Vec<Room>, string> {
  const availableRooms = roomStorage.values().filter((room) => !room.is_booked);
  if (availableRooms.length == 0) {
    return Result.Err("No available rooms currently");
  }
  return Result.Ok(availableRooms);
}

$update;
// Function to add a new room
export function addRoom(payload: RoomPayload): string {
  if (hotelStorage.isEmpty()) {
    initHotel("Luxury Hotel");
  }
  
  if (isHotelOwner(ic.caller().toText())) {
    return `Action reserved for the hotel owner`;
  }
  const room = {
    id: uuidv4(),
    room_number: payload.room_number,
    is_booked: false,
    price: payload.price,
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  roomStorage.insert(room.id, room);
  return room.id;
}

// Function to check if person making the request is the hotel owner
function isHotelOwner(caller: string): boolean {
    const hotel = hotelStorage.values()[0];
    return hotel.owner.toText() != caller;
}

$update;
// Function to make a reservation
export function makeReservation(payload: ReservationPayload): string {
  const reservation = {
    id: uuidv4(),
    room_id: payload.room_id,
    guest: ic.caller(),
    check_in_date: payload.check_in_date,
    check_out_date: payload.check_out_date,
    created_date: ic.time(),
  };
  reservationStorage.insert(reservation.id, reservation);

  const room = match(roomStorage.get(payload.room_id), {
    Some: (room) => room,
    None: () => ({} as unknown as Room),
  });
  if (room) {
    room.is_booked = true;
    roomStorage.insert(room.id, room);
  }
  return `Your Reservation ID: ${reservation.id} for Room: ${room.room_number}`;
}

$query;
// Function to check out and pay for a reservation
export function checkOutAndPay(id: string, amount: string): PaymentResponse {
  return match(reservationStorage.get(id), {
    Some: (reservation) => {
      if (reservation.guest.toText() != ic.caller().toText()) {
        return {
          msg: "You are not the guest for this reservation. Check your reservation ID",
          amount: 0,
        };
      }
      const room = match(roomStorage.get(reservation.room_id), {
        Some: (room) => room,
        None: () => ({} as unknown as Room),
      });
      if (room) {
        room.is_booked = false;
        roomStorage.insert(room.id, room);
      }
      const payment = {
        id: uuidv4(),
        reservation_id: id,
        amount: amount,
        created_date: ic.time(),
        updated_at: Opt.None,
      };
      paymentStorage.insert(payment.id, payment);
      return {
        msg: `Thank you for your stay. Payment of \$${amount} processed successfully`,
        amount: parseFloat(amount),
      };
    },
    None: () => {
      return {
        msg: `Reservation not found. Please check your reservation ID`,
        amount: 0,
      };
    },
  });
}

$update;
// Function to update information for a room
export function updateRoom(id: string, payload: RoomPayload): string {
  if (isHotelOwner(ic.caller().toText())) {
    return "Action reserved for the hotel owner";
  }
  const room = match(roomStorage.get(id), {
    Some: (room) => room,
    None: () => ({} as unknown as Room),
  });
  if (room) {
    room.room_number = payload.room_number;
    room.price = payload.price;
    room.updated_at = Opt.Some(ic.time());
    roomStorage.insert(room.id, room);
  }
  return room.id;
}

$update;
// Function to delete a room
export function deleteRoom(id: string): string {
  if (isHotelOwner(ic.caller().toText())) {
    return "Action reserved for the hotel owner";
  }
  roomStorage.remove(id);
  return `Room of ID: ${id} removed successfully`;
}

// Mocking the 'crypto' object for testing purposes
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
