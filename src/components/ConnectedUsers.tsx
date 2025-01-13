import React from 'react';
import { useUsers } from '@/providers/Users/UsersProvider';
import { User } from '@/providers/Users/users-server'; // Ensure this path is correct

export function ConnectedUsers() {
  const { thisUser, users } = useUsers();

  const thisUserWithPossiblyName = users.find((user) => user.id === thisUser);

  const textFormattedWithoutThisUser = users.reduce((acc, cur) => {
    if (cur.id === thisUser) {
      return acc;
    }

    if (acc !== "") {
      acc += ", ";
    }

    if (cur.name) {
      acc += cur.name;
    } else {
      acc += cur.id;
    }

    return acc;
  }, "");

  return (
    <div className="connected-users">
      Users: ({users.length}) {textFormattedWithoutThisUser}
      {textFormattedWithoutThisUser.length !== 0 ? ", " : ""}
      <span className="text-green-600">
        {thisUserWithPossiblyName?.name
          ? thisUserWithPossiblyName.name
          : thisUserWithPossiblyName?.id}
      </span>
    </div>
  );
}
