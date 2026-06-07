import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

// Amplify Gen 2 backend entry point.
// For this beginner workshop, we only add Data. No login/auth is required.
defineBackend({
  data,
});
