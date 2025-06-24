import dynamic from "next/dynamic"
import AfroNavigation from "@/components/AfroNavigation"
import MainFilmSlider from "@/components/MainFilmSlider"
import FilmGenreExplorer from "@/components/FilmGenreExplorer"
import TrendingFilmsGrid from "@/components/TrendingFilmsGrid"
import AfroFooter from "@/components/AfroFooter"

export default function Home() {
  return (
    <>
      <AfroNavigation />
      <main className="pt-20">
        <MainFilmSlider />
        <FilmGenreExplorer />
        <TrendingFilmsGrid />
      </main>
      <AfroFooter />
    </>
  )
}
