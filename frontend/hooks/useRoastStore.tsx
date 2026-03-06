'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { Commit, RoastSession, AppStatus } from '@/types';

type State = {
  repo: string;
  status: AppStatus;
  commits: Commit[];
  commitCount: number;
  error: string | null;
  session: RoastSession | null;
};

type Action =
  | { type: 'SET_REPO'; repo: string }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_PROGRESS'; count: number }
  | { type: 'FETCH_SUCCESS'; commits: Commit[] }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'ROAST_START' }
  | { type: 'ROAST_SUCCESS'; session: RoastSession }
  | { type: 'ROAST_ERROR'; error: string }
  | { type: 'RESET' };

const initialState: State = {
  repo: '',
  status: 'idle',
  commits: [],
  commitCount: 0,
  error: null,
  session: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_REPO':
      return { ...state, repo: action.repo };
    case 'FETCH_START':
      return { ...state, status: 'fetching', error: null, commits: [], commitCount: 0 };
    case 'FETCH_PROGRESS':
      return { ...state, commitCount: action.count };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'scoring', commits: action.commits };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'ROAST_START':
      return { ...state, status: 'roasting' };
    case 'ROAST_SUCCESS':
      return { ...state, status: 'done', session: action.session };
    case 'ROAST_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const RoastContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);

export function RoastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <RoastContext.Provider value={{ state, dispatch }}>
      {children}
    </RoastContext.Provider>
  );
}

export function useRoastStore() {
  const ctx = useContext(RoastContext);
  if (!ctx) throw new Error('useRoastStore must be used within RoastProvider');
  return ctx;
}
