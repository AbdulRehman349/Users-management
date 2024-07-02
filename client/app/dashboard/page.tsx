import SearchComponent from '@/ui/search-component';
import ProfileList from './_components/profile-list';
import UserInfo from './_components/user-info';
import Header from '@/ui/header';

const DashboardPage = () => {
  return (
    <main className='flex flex-col w-full h-screen bg-white p-4' >
      <Header/>
      <div className='h-auto'>
        <UserInfo/>
      </div>
      <div className='flex-grow'>
        <SearchComponent/>
        <ProfileList />
      </div>

    </main>
  )
}

export default DashboardPage