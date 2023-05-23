import { useLocation } from 'react-router-dom';
import ActivityList from '../../components/ActivityList';
import { projectFirestore } from '../../firebase/config';
import { useEffect, useState } from 'react';

// styles
import './Search.css';

export default function Search() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get('q');
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const searchKeywords = query
      .toLowerCase()
      .split(' ')
      .filter((word) => word.trim() !== '');

    const unsub = projectFirestore
      .collection('Activities')
      .where('tags', 'array-contains-any', searchKeywords)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            setError('No activities to load...');
            setIsPending(false);
            setData(null);
          } else {
            let results = [];
            snapshot.docs.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
              setError('');
            });
            setData(results);
            setIsPending(false);
          }
        },
        (err) => {
          setError(err.message);
          setIsPending(false);
        }
      );

    return () => unsub();
  }, [query]);

  return (
    <div>
      <h2 className="page-title">Activities including "{query}"</h2>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <ActivityList activities={data} />}
    </div>
  );
}
