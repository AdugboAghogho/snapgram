const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <img
        src="/public/assets/images/logo.svg"
        alt="logo"
        className="w-[15rem] h-[15rem] animate-bounce"
      />
    </div>
  );
};

export default SplashScreen;
