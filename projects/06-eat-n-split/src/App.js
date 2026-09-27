import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showFormAddFriend, setShowFormAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFormAddFriend() {
    setShowFormAddFriend((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFormAddFriend(false);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowFormAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriend.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend,
      ),
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
        />
        {showFormAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFormAddFriend}>
          {showFormAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelectFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend =
    bill !== "" && paidByUser !== "" ? Number(bill) - Number(paidByUser) : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (bill === "" || Number(bill) <= 0 || paidByUser === "") return;

    const value =
      whoIsPaying === "user" ? Number(paidByFriend) : -Number(paidByUser);

    onSplitBill(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend?.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="number"
        min="0"
        value={bill}
        onChange={(e) => {
          const value = e.target.value;

          if (value === "") {
            setBill("");
            setPaidByUser("");
            return;
          }

          const newBill = Number(value);

          if (newBill <= 0) return;

          setBill(value);

          if (Number(paidByUser) > newBill) {
            setPaidByUser(value);
          }
        }}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) => {
          const value = e.target.value;

          if (value === "") {
            setPaidByUser("");
            return;
          }

          const numValue = Number(value);

          if (numValue >= 0 && numValue <= Number(bill)) {
            setPaidByUser(value);
          }
        }}
      />

      <label>🧑‍🤝‍🧑 {selectedFriend?.name}'s expense</label>
      <input type="number" value={paidByFriend} disabled />

      <label>🤑 Who's paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend?.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
