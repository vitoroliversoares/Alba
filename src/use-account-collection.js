import { useEffect, useState } from 'react';
import { getAccountService } from '../public/assets/account-service.js';
import { createAccountCollection, EMPTY_COLLECTION } from './account-collection.js';

let collectionPromise;
export function useAccountCollection() {
  const [collection, setCollection] = useState(null);
  const [state, setState] = useState(EMPTY_COLLECTION);
  useEffect(() => {
    let active = true;
    let unsubscribe;
    collectionPromise ??= getAccountService().then(createAccountCollection);
    collectionPromise.then(value => {
      if (!active) return;
      setCollection(value);
      setState(value.getState());
      unsubscribe = value.subscribe(setState);
    });
    return () => { active = false; unsubscribe?.(); };
  }, []);
  return { collection, state };
}
