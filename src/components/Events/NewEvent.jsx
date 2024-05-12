import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error} = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events']}); //invalidate all the cached data react query has for this queryKey (not exact)
      navigate('/events')
    }
  })

  function handleSubmit(formData) {
    mutate({ event: formData});
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Sending Event Data...'}
        {!isPending &&<>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>
      {isError && (
        <ErrorBlock title="Failed to create event"
         message={
          error.info?.message || "Event creation failed. Please check you inputs and try again later"
         } />
      )}
    </Modal>
  );
}
