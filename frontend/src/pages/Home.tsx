import Navbar from "../components/ui/Navbar"
import ThemeToggler from "../components/ui/ThemeToggler"

function Home() {
  return (
    <div>
      <Navbar />
      <div className="mt-4 hidden xl:block">
        <ThemeToggler />
      </div>
    </div>
  )
}
export default Home
