import React, { useState, useContext, useEffect, useCallback,} from 'react';
import {auth, db,AuthenticationContext,} from '../../services/Firebase';
import { GiftedChat } from 'react-native-gifted-chat';
import {collection,addDoc, getDoc, query, orderBy, onSnapshot,doc,} from 'firebase/firestore';

const ChatScreen = ({ navigation, userid }) => {
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState('');

  const { user } = useContext(AuthenticationContext);
  const chatDocRef = doc(db, 'users/' + user.email);

  useEffect(() => {
    const getsession = async () => {
      const chatid = await getDoc(chatDocRef);
      setSession(chatid.data()['chat session']);
    };

    getsession()
      .then(() => {})
      .catch(console.error);

    if (session.length != 0) {
      const q = query(collection(db, 'session', 'chat history', session),orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        )
      );
    }
  }, [navigation, session.length == 0]);

  const onSend = useCallback(
    (messages = []) => {
      //if query is still occuring
      if (session.length == 0) {
        setMessages([
          {
            _id: 1,
            text: 'loading user history...',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'plus-one',
              avatar: require('../../assets/user.png'),
            },
          },
        ]);
      } else { //render messages loaded from database
        setMessages((previousMessages) =>GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(db, 'session', 'chat history', session), {_id, createdAt, text, user,});

      }
    },
    [session.length]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderUsernameOnMessage={true}
      user={{
        _id: auth.currentUser.email,
        name: auth.currentUser.email,
        avatar: require('../../assets/user.png'),
      }}
    />
  );
};

export default ChatScreen;
