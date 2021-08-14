import React, { useState, useEffect} from 'react'
import { initializeApp } from 'firebase/app'
import { Card, TextField} from '@material-ui/core'
import {} from 'firebase/analytics'
import { getFirestore, collection, onSnapshot,
  doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import useStyles from '../../../styles/GuestbookStyles.js'
import { Icon } from '@iconify/react'
import pushpinFilled from '@iconify/icons-ant-design/pushpin-filled'
import pushpinOutlined from '@iconify/icons-ant-design/pushpin-outlined'
import closeBig from '@iconify/icons-ci/close-big'
import PropTypes from 'prop-types'

const firebaseConfig = {
  apiKey: 'AIzaSyB1UUFi6J3-_2BRE06qTVbxrw3TZgXC874',
  authDomain: 'blog-99efa.firebaseapp.com',
  projectId: 'blog-99efa',
  storageBucket: 'blog-99efa.appspot.com',
  messagingSenderId: '179354454856',
  appId: '1:179354454856:web:170649d30c5f510bcdc17d',
  measurementId: 'G-G18EWH3KDE',
}

initializeApp(firebaseConfig)
const gb = getFirestore()
const messageCollection = collection(gb, 'messages')


// create post-it surfaces
// clicking 'pin' submits the data to firestore and brings in a new post-it
// dragging any surface to the trash can area deletes it from the database
// show little popup saying 'message submitted'!

// surface for the guestbook actions
// has a state of either editable or not editable
const Postcard = (props) => {
  const classes = useStyles()

  const [isDragged, setIsDragged ] = useState(false)
  const [isEditable, setIsEditable] = useState(props.editable)
  const [ x, setX ] = useState(props.x)
  const [ y, setY ] = useState(props.y)

  const [ message, setMessage ] = useState(props.message)

  const cardRef = props.id && doc(gb, 'messages', props.id)

  const handleInput = (e) => {
    if (!isEditable) return
    setMessage(e.target.value)
  }

  const handleDrag = (e) => {
    if (!isDragged || !isEditable) return
    setY(e.pageY)
    setX(e.pageX)
  }

  const handleSubmit = () => {
    if (typeof props.id === 'undefined') {
      addDoc(messageCollection, {x, y, message})
    } else {
      updateDoc(cardRef, {x, y, message})
    }

    setIsEditable(!isEditable) // state update at end because async
  }

  const deleteCard = () => {
    if (typeof props.id === 'undefined') {
      //
      console.log('props.id is undefined')
    } else {
      deleteDoc(cardRef)
      // the listener to the remote archive
      // in the parent should hopefully update and rerender
    }
  }

  return (
    <Card onMouseDown={() => setIsDragged(true)}
      onMouseUp={() => setIsDragged(false)}
      onMouseMove={handleDrag} className={classes.card}
      style={{top: `${y}px`, left: `${x}px`}}>
      {/* this is undefined in the beginning, that's ok*/}
      <button onClick={handleSubmit} className={classes.button}>
        <Icon icon={isEditable ? pushpinOutlined : pushpinFilled}
          className={classes.icon}/>
      </button>
      <button onClick={deleteCard} className={classes.button}>
        <Icon icon={closeBig} className={classes.icon} />
      </button>
      <TextField className={classes.cardElement}
        disabled={!isEditable}
        label='type a message here'
        onKeyPress={handleInput}
        onChange={handleInput}
        multiline
        rows={6}
        value={message} />
    </Card>
  )
}

Postcard.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  editable: PropTypes.bool,
  message: PropTypes.string,
}


const Guestbook = () => {
  const [archive, setArchive] = useState(undefined)

  // the following block listens for snapshots
  //    on the first pass, archive is undefined, so its value is set to docs
  //    on every subsequent pass, the
  //  archive should be updated with the changed data
  const unsubscribe = onSnapshot(messageCollection, (snapshot) => {
    console.log('snapshot taken', snapshot.docChanges())
    if (typeof archive === 'undefined') {
      setArchive(snapshot.docs)
      return
    }

    snapshot.docChanges().forEach((change) => {
      const index = archive.map((d) => d.id).indexOf(change.doc.id)
      const archiveCopy = [...archive]

      if (change.type === 'added') prevArchive.push(change.doc)
      if (change.type === 'modified') archiveCopy[index] = change.doc
      if (change.type === 'removed') archiveCopy.splice(index, 1)

      setArchive(archiveCopy)
    })
  })
  useEffect(() => unsubscribe, [unsubscribe]) // cleanup for event listener

  useEffect(() => console.log(archive))
  const archiveCards = archive && archive.map((doc) => {
    const {x, y, message} = doc.data()
    return <Postcard
      key={doc.id} id={doc.id}
      x={x} y={y}
      message={message} />
  })

  return (
    <>
      <Postcard editable />
      {typeof archive != 'undefined' && archiveCards}
    </>
  )
}

export default Guestbook
