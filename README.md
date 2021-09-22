![client_banner](https://user-images.githubusercontent.com/49595640/130368393-8f5a1d8d-eee1-4955-85ac-46718e1a21b4.png)

# Client

## Related Projects

- [tria-frontend](https://github.com/WhySoBad/tria-frontend)
- [tria-backend](https://github.com/WhySoBad/tria-backend)

## Usage

### Installation

```cmd
npm install https://github.com/WhySoBad/tria-client
```

### Create Client Instance

```typescript
const client: Client = new Client({ log: true, credentials: { username: MAIL_ADDRESS, password: PASSWORD });
```

or

```typescript
const client: Client = new Client({ log: true, credentials: { token: AUTH_JWT });
```

### Client

> A client instance represents a logged in user

#### Credentials

> The credentials are null when the user logs in with an auth token

```typescript
client.credentials.username; //mail address of the user
client.credentials.password; //password of the user
```

#### Token

> User auth token to send requests to the server

```typescript
client.token;
```

#### Connected

> Boolean whether the user is already connected to the server

```typescript
client.connected;
```

#### User

> Get the relatead ClientUser instance

```typescript
client.user;
```

#### Connect

> Method to connect the client to the server

```typescript
client.connect().then(() => ...).catch(() => ...)
```

#### Disconnect

> Method to disconnect the client from the server

```typescript
client.disconnect().then(() => ...).catch(() => ...)
```

#### Login

> Method to log the user in [generate auth token, validate current token]

> Gets called automatically in connect

```typescript
client.login().then(() => ...).catch(() => ...)
```

#### Delete

> Method to delete the logged in user

```typescript
client.delete().then(() => ...).catch(() => ...)
```

#### Create private chat

> Method to create a new private chat

```typescript
client.createPrivateChat(participantUuid).then((chatUuid) => ...).catch(() => ...)
```

#### Create group chat

> Method to create a new group chat

```typescript
client.createGroupChat({ name: groupName,
  tag: groupTag,
  description: groupDescription,
  type: groupType,
  members: [memberUuids]}).then((chatUuid) => ...).catch(() => ...)
```

#### Join group

> Method to join an existing group

```typescript
client.joinGroup(groupUuid).then(() => ...).catch(() => ...)
```

#### Leave group

> Method to leave an existing group

```typescript
client.leaveGroup(groupUuid).then(() => ...).catch(() => ...)
```

#### Change password

> Method to change the password of the user

```typescript
client.changePassword(oldPassword, newPassword).then(() => ...).catch(() => ...)
```

#### Search

> Method to search for other users and public group chats

```typescript
client.search(searchOptions).then((results) => ...).catch(() => ...)
```

### ClientUser

> The user instance of the logged in user

#### Client

> The client which initialized the clientuser

```typescript
client.user.client;
```

#### Uuid

> The uuid of the logged in user

```typescript
client.user.uuid;
```

#### CreatedAt

> The timestamp when the user was created

```typescript
client.user.createdAt;
```

#### Name

> The name of the user

```typescript
client.user.name;
```

#### Tag

> The tag of the user

```typescript
client.user.tag;
```

#### Description

> The discription of the user

```typescript
client.user.description;
```

#### Mail

> The mail address of the user

```typescript
client.user.mail;
```

#### LastSeen

> The timestamp when the user was last seen

```typescript
client.user.lastSeen;
```

#### Online

> Boolean whether the user is currently online

```typescript
client.user.online;
```

#### Locale

> The locale of the logged in user

```typescript
client.user.locale;
```

#### AvatarURL

> The url to the avatar of the user

```typescript
client.user.avatarURL;
```

#### Chats

> The chats of the user

```typescript
client.user.chats;
```

#### Color

> The color of the user

```typescript
client.user.color;
```

#### SetName

> Method to change the user's name

```typescript
client.user.setName(newName).then(() => ...).catch(() => ...)
```

#### SetTag

> Method to change the user's tag

```typescript
client.user.setTag(newTag).then(() => ...).catch(() => ...)
```

#### SetDescription

> Method to change the user's description

```typescript
client.user.setDescription(newDescription).then(() => ...).catch(() => ...)
```

#### SetLocale

> Method to change the user's locale

```typescript
client.user.setLocale(newLocale).then(() => ...).catch(() => ...)
```

#### SetSettings

> Shorthand method for setName, setTag, setDescription and setLocale

> Multiple parameters can be changed within one method call

```typescript
client.user.setSettings(newSettings).then(() => ...).catch(() => ...)
```

#### SetAvatar

> Method to upload a new avatar

```typescript
client.user.setAvatar(newAvatar).then(() => ...).catch(() => ...)
```

#### DeleteAvatar

> Method to delete the existing avatar

```typescript
client.user.deleteAvatar().then(() => ...).catch(() => ...)
```

### User

> User instance representing an user

> Important: The logged in user is represented by a ClientUser instance

#### Client

> The currently logged in client

```typescript
user.client;
```

#### Uuid

> The uuid of the user

```typescript
user.uuid;
```

#### CreatedAt

> The timestamp when the user was created

```typescript
user.createdAt;
```

#### Name

> The name of the user

```typescript
user.name;
```

#### Tag

> The tag of the user

```typescript
user.tag;
```

#### Description

> The discription of the user

```typescript
user.description;
```

#### LastSeen

> The timestamp when the user was last seen

```typescript
user.lastSeen;
```

#### Online

> Boolean whether the user is currently online

```typescript
user.online;
```

#### Locale

> The locale of the logged in user

```typescript
user.locale;
```

#### AvatarURL

> The url to the avatar of the user

```typescript
user.avatarURL;
```

#### Color

> The color of the user

```typescript
user.color;
```

### Chat

> Chat instance representing an user

#### Client

> The currently logged in client

```typescript
chat.client;
```

#### Uuid

> Uuid of the chat

```typescript
chat.uuid;
```

#### CreatedAt

> Timestamp when the chat was created

```typescript
chat.createdAt;
```

#### Color

> Color of the chat

```typescript
chat.color;
```

#### Type

> Type of the chat

```typescript
chat.type;
```

#### LastRead

> Timestamp of the last message read by the logged in user in this chat

```typescript
chat.lastRead;
```

#### Members

> All members of the chat

```typescript
chat.members;
```

#### Writable

> Boolean whether the logged in user is member of the chat

```typescript
chat.writeable;
```

#### Messages

> All currently fetched messages of the chat

```typescript
chat.messages;
```

#### LastFetched

> Boolean whether the last message of the chat was fetched

```typescript
chat.lastFetched;
```

#### MemberLog

> MemberLog of the chat

```typescript
chat.memberLog;
```

#### Delete

> Method to delete the chat

```typescript
chat.delete().then(() => ...).catch(() => ...)
```

#### SendMessage

> Method to send a message in the chat

```typescript
chat.sendMessage(message).then(() => ...).catch(() => ...)
```

#### FetchMessages

> Method to fetch a specific amount of messages after a given timestamp

```typescript
chat.fetchMessages(timestamp, amount).then(() => ...).catch(() => ...)
```

#### ReadUntil

> Mark messages until a given timestamp as read

```typescript
chat.readUntil(timestamp).then(() => ...).catch(() => ...)
```

### Group

> Group instance representing a group chat

> Extends chat

#### Name

> Name of the group

```typescript
group.name;
```

#### Tag

> Tag of the group

```typescript
group.tag;
```

#### Description

> Description of the group

```typescript
group.description;
```

#### AvatarURL

> Url to the avatar of the group

```typescript
group.avatarURL;
```

#### Public

> Boolean whether the group is public or private

```typescript
group.public;
```

#### CanEditGroup

> Boolean whether the logged in user can edit the group

```typescript
group.canEditGroup;
```

#### CanEditMembers

> Boolean whether the logged in user can edit group members

```typescript
group.canEditMembers;
```

#### CanBan

> Boolean whether the logged in user can ban group members

```typescript
group.canBan;
```

#### CanUnban

> Boolean whether the logged in user can unban banned members

```typescript
group.canUnban;
```

#### CanKick

> Boolean whether the logged in user can kick group members

```typescript
group.canKick;
```

#### CanDelete

> Boolean whether the logged in user can delete the chat

```typescript
group.canDelete;
```

#### BannedMembers

> All banned members of the group

```typescript
group.bannedMembers;
```

#### Delete

> Method to delete the group

```typescript
group.delete().then(() => ...).catch(() => ...)
```

#### SetName

> Method to change the name of the group

```typescript
group.setName(newName).then(() => ...).catch(() => ...)
```

#### SetTag

> Method to change the tag of the group

```typescript
group.setTag(newTag).then(() => ...).catch(() => ...)
```

#### SetDescription

> Method to change the description of the group

```typescript
group.setDescription(newDescription).then(() => ...).catch(() => ...)
```

#### SetType

> Method to change the type of the group

```typescript
group.setType(newType).then(() => ...).catch(() => ...)
```

#### SetName

> Shorthand method for setName, setTag, setDescription and setType

> The method can edit multiple parameters with one method call

```typescript
group.setSettings(newSettings).then(() => ...).catch(() => ...)
```

#### SetAvatar

> Method to change the avatar of the group

```typescript
group.setAvatar(newAvatar).then(() => ...).catch(() => ...)
```

#### DeleteAvatar

> Method to delete the avatar of the group

```typescript
group.deleteAvatar().then(() => ...).catch(() => ...)
```

#### BanMember

> Method to ban a group member

```typescript
group.banMember(member).then(() => ...).catch(() => ...)
```

#### UnbanMember

> Method to unban a group member

```typescript
group.unbanMember(userUuid).then(() => ...).catch(() => ...)
```

#### KickMember

> Method to kick a group member

```typescript
group.kickMember(member).then(() => ...).catch(() => ...)
```

#### EditMember

> Method to edit a group member

```typescript
group.editMember(member, options).then(() => ...).catch(() => ...)
```

### PrivateChat

> PrivateChat instance represents a private chat

> Extends chat

#### Participant

> Participant of the private chat

```typescript
chat.participant;
```

### Member

> Member instance represents a member in a chat

#### User

> User of the member

```typescript
member.user;
```

#### JoinedAt

> Timestamp when the member joined the group

```typescript
member.joinedAt;
```

#### Role

> Role of the member

```typescript
member.role;
```

### Owner

> Owner instance represents an owner in a group

> Extends member

### Admin

> Admin instance represents an admin in a group

> Extends member

#### PromotedAt

> Timestamp when the admin was promoted

```typescript
admin.promotedAt;
```

#### Permissions

> Permissions of the admin

```typescript
admin.permissions;
```

#### CanBan

> Boolean whether the admin can ban members

```typescript
admin.canBan;
```

#### CanUnban

> Boolean whether the admin can unban banned members

```typescript
admin.canUnban;
```

#### CanEditGroup

> Boolean whether the admin can edit the group

```typescript
admin.canEditGroup;
```

#### CanKick

> Boolean whether the admin can kick group members

```typescript
admin.canKick;
```

## License

MIT © [WhySoBad](https://github.com/WhySoBad)
