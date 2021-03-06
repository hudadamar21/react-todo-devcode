import { lazy, Suspense, useEffect, useState } from "react"
import useActivity from "../services/useActivity"

import ModalDelete from "../components/ModalDelete"
import Alert from "../components/Alert"
import AcCard from "../components/AcCard"
import AddButton from "../components/AddButton"

const ActivityEmptyState = lazy(() => import("../components/ActivityEmptyState"))

function Home() {
  const [activity, setActivity ] = useState([])
  const [ deleteActivityData, setDeleteActivityData] = useState(null)
  const [ alertMessage, setAlertMessage] = useState(null)
  const Activity = useActivity()

  useEffect( async () => {
    await getActivity()
    return () => setActivity([])
  }, [])

  const getActivity = async () => {
    const data = await Activity.get()
    setActivity(data.data)
  }

  const createActivity = async () => {
    await Activity.create({ title: 'New Activity', email: 'hudadamar21@gmail.com' })
    getActivity()
  }
  
  const openDeleteModal = (e, ac) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteActivityData(ac)
  }

  const handleDeleteActivity = async () => {
    await Activity.remove(deleteActivityData.id)
    const newAc = activity.filter(ac => ac.id !== deleteActivityData.id)
    setActivity(newAc)
    setDeleteActivityData(null)
    setAlertMessage('Activity berhasil dihapus')
  }

  return <>
    <div className="flex items-center justify-between py-10">
      <h1 className="text-4xl font-bold" data-cy="activity-title">
        Activity
      </h1>
      <Suspense fallback={<div></div>}>
        <AddButton onClick={createActivity} dataCy="activity-add-button" />
      </Suspense>
    </div>
    {
      activity.length
      ? <div className="grid gap-3 pb-10 grid-cols-4">
          {activity.map((ac, index) => (
            <AcCard 
              key={ac.id} 
              index={index} 
              onDelete={(e) => openDeleteModal(e, ac)}
              {...ac} 
            />
          ))}
        </div>
      : <Suspense fallback={<div></div>}><ActivityEmptyState/></Suspense>
    }

    {
      deleteActivityData &&
      <ModalDelete
        data={deleteActivityData}
        onClose={() => setDeleteActivityData(null)}
        handleDelete={handleDeleteActivity}
      />
    }

    <Alert 
      message={alertMessage}
      onClose={() => setAlertMessage('')}
    />
  </>
}

export default Home