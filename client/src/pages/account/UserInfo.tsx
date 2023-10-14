import { useState } from "react";
import logo from '../../assets/logos/LogoAUTHblack300ppi.png'

const UserInfo: React.FC<{}> = () => {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const data = {
    user: {
      name: 'Dimitris',
      email: 'triantafd@auth.gr'
    }
  }

  return (
    <form>
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
      )}
      <div className="min-h-[200px]">
        {data?.user ? (
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#07074D]">Profile Image</label>
              <img src={logo} alt="Logo" className="w-16 h-16" />
            </div>

            <div>
              <label className="font-semibold text-[#07074D]">Username</label>
              <div className="mb-6 text-[#07074D]">{data?.user?.name}</div>
              <label className="font-semibold text-[#07074D]">Email</label>
              <div className="mb-6 text-[#07074D]">{data?.user?.email}</div>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-[#07074D]">loading info...</div>
        )
        }
      </div >
    </form >

  );
};

export default UserInfo;