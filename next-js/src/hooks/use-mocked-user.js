import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Ahmad Swedani',
    email: 'test@Blogly.cc',
    password: 'demo1234',
    photoURL: _mock.image.avatar(24),
    phoneNumber: '+9620795780501',
    country: 'Jordan',
    address: '1234 Main Street',
    state: 'Amman',
    city: 'Amman',
    zipCode: '11111',
    about: 'I love coding and building applications.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
