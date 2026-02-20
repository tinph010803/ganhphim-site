import CastList from "@/components/cast/List";

export async function generateMetadata({params}) {
  return {
    title: `Diễn viên`,
  }
}

const CastPage = () => {
  return (
    <div id="wrapper">
      <div className="fluid-gap">
        <div className="cards-row wide">
          <div className="row-header">
            <h3 className="category-name">Diễn viên</h3>
          </div>
          <CastList initFilter={{}}/>
        </div>
      </div>
    </div>
  )
}

export default CastPage