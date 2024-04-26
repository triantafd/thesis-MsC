import ContentWrapper from "../../components/wrappers/ContentWrapper";
import UserInfo from "./UserInfo";

const Account: React.FC<{}> = () => {
  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased mb-8">
        Account
      </h1>
      <div className="spacing-4 flex flex-col">
        <ContentWrapper>
          <h4 className="text-[#07074D] text-xl font-medium mb-8">
            Account info
          </h4>
          <UserInfo />
          <div className="text-xs text-black text-center">
            Info cannot be changed, in beta version.
          </div>
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Account;