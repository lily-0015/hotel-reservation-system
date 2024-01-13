### Hotel Reservation System Documentation

#### 1. Introduction
The Hotel Reservation System is implemented in TypeScript, a popular programming language. This system enables the management of hotels, rooms, reservations, and payments.
#### 2. Entities

##### Hotel Entity
- **Fields:**
  - `id`: Unique identifier for the hotel.
  - `name`: Name of the hotel.
  - `owner`: Principal representing the owner of the hotel.
  - `created_date`: Timestamp indicating when the hotel was created.
  - `updated_at`: Optional timestamp for the last update.

##### Room Entity
- **Fields:**
  - `id`: Unique identifier for the room.
  - `room_number`: Room number or identifier.
  - `is_booked`: Boolean indicating if the room is currently booked.
  - `price`: Price per night for the room.
  - `created_date`: Timestamp indicating when the room was created.
  - `updated_at`: Optional timestamp for the last update.

##### Reservation Entity
- **Fields:**
  - `id`: Unique identifier for the reservation.
  - `room_id`: Identifier of the booked room.
  - `guest`: Principal representing the guest who made the reservation.
  - `check_in_date`: Timestamp for the check-in date.
  - `check_out_date`: Timestamp for the check-out date.
  - `created_date`: Timestamp indicating when the reservation was made.

##### Payment Entity
- **Fields:**
  - `id`: Unique identifier for the payment.
  - `reservation_id`: Identifier of the associated reservation.
  - `amount`: Payment amount.
  - `created_date`: Timestamp indicating when the payment was processed.
  - `updated_at`: Optional timestamp for the last update.

#### 3. Functions

##### `initHotel(name: string): string`
- Initializes the hotel with a given name.
- Returns the unique identifier of the hotel.

##### `getAvailableRooms(): Result<Vec<Room>, string>`
- Retrieves a list of available rooms.
- Returns a `Result` type containing either a vector of available rooms or an error message.

##### `addRoom(payload: RoomPayload): string`
- Adds a new room to the system.
- Requires the caller to be the hotel owner.
- Returns the unique identifier of the added room.

##### `makeReservation(payload: ReservationPayload): string`
- Makes a reservation for a room.
- Updates the room status to booked.
- Returns the unique identifier of the reservation.

##### `checkOutAndPay(id: string, amount: string): PaymentResponse`
- Checks out and processes payment for a reservation.
- Updates the room status to available.
- Returns a response containing a message and the payment amount.

##### `updateRoom(id: string, payload: RoomPayload): string`
- Updates information for a specific room.
- Requires the caller to be the hotel owner.
- Returns the unique identifier of the updated room.

##### `deleteRoom(id: string): string`
- Deletes a room from the system.
- Requires the caller to be the hotel owner.
- Returns a success message.

#### 4. Mocking

- The 'crypto' object is mocked for testing purposes, providing random values for cryptographic operations.

#### 5. Usage Guidelines

- Ensure to initialize the hotel before performing other operations.
- Hotel owner privileges are required for certain actions.
- The system provides functions to manage rooms, make reservations, process check-outs, and update room information.

#### 6. Testing

- The system is equipped with a mocked 'crypto' object for testing cryptographic functions.
- Test the system with different scenarios to ensure proper functionality.

#### 7. Additional Considerations

- This documentation serves as an overview. Additional features and improvements can be added based on specific requirements.
- Adapt the system to the needs of your application, considering security and scalability.

#### 8. License

- This code is provided under [insert license information].

#### 9. Contact Information

- [Insert contact information for support or inquiries].


### Prerequisites

- Node.js installed on the server.

### Steps

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/lily-0015/hotel-reservation-system.git
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm start
   ```
4. Deploy the application:

   ```bash
   npm deploy
   ```
