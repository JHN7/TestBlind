function Header({ onClick }) {
  return (
    <header className="fixed top-0 left-0 w-full p-4 bg-gray-900 z-50">
      <div
        className="text-2xl tracking-widest text-white select-none cursor-pointer"
        onClick={onClick}
      >
        TestBlind
      </div>
    </header>
  );
}

export default Header;