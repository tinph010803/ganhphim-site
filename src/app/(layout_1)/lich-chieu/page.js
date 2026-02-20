import {getMetadata} from "@/utils/metadata";
import ScheduleDateSlide from "@/components/schedule/DateSlide";
import ScheduleData from "@/components/schedule/Data";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
  return await getMetadata({page: "schedule"})
}

export async function generateMetadata({params}) {
  const {title, description, metadataBase, openGraph} = await pageMetadata()
  return {
    title,
    description,
    metadataBase,
    openGraph: {
      ...openGraph
    },
    alternates: {
      canonical: `/lich-chieu`
    }
  }
}

const SchedulePage = async () => {
  const {h1} = await pageMetadata()

  return (
    <div id="wrapper" className="wrapper-schedules">
      <H1Tags text={h1}/>
      <div className="fluid-gap">
        <div className="cards-row wide">
          <div className="row-header">
            <div className="inc-icon text-white">
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g id="Layer_37" data-name="Layer 37">
                  <path d="M13.5,13.5a1,1,0,0,1,0-2A1.5,1.5,0,1,0,12,10a1,1,0,0,1-2,0,3.5,3.5,0,1,1,3.5,3.5Z"></path>
                  <path d="M20.5,13.5a1,1,0,0,1,0-2A1.5,1.5,0,1,0,19,10a1,1,0,0,1-2,0,3.5,3.5,0,1,1,3.5,3.5Z"></path>
                  <path d="M27.5,13.5a1,1,0,0,1,0-2A1.5,1.5,0,1,0,26,10a1,1,0,0,1-2,0,3.5,3.5,0,1,1,3.5,3.5Z"></path>
                  <path d="M34.5,13.5a1,1,0,0,1,0-2A1.5,1.5,0,1,0,33,10a1,1,0,0,1-2,0,3.5,3.5,0,1,1,3.5,3.5Z"></path>
                  <path
                    d="M40.98,15.8l-.99-5.96A.99913.99913,0,0,0,39,9H9a.41361.41361,0,0,0-.15991.02.937.937,0,0,0-.16016.04A.99475.99475,0,0,0,8,10v.07L3.01,39.83a1.062,1.062,0,0,0,.23.82A1.01091,1.01091,0,0,0,4,41H44a1.0039,1.0039,0,0,0,.99-1.16ZM35,28a8,8,0,1,1-8-8A8.00917,8.00917,0,0,1,35,28Zm3.1499-17,.67017,4H10.8667L10.2,11ZM8,39H5.17993L8,22.17l1.01831-6.07983c.00293.03119.01245.05994.01831.09027L10,21.99,12.82007,39Z"></path>
                  <path
                    d="M21,28a6,6,0,1,0,6-6A6.00657,6.00657,0,0,0,21,28Zm7-3v2.58594l1.707,1.707A.99989.99989,0,1,1,28.293,30.707l-2-2A.99927.99927,0,0,1,26,28V25a1,1,0,0,1,2,0Z"></path>
                </g>
              </svg>
            </div>
            <h3 className="category-name">Lịch chiếu</h3>
            <div className="flex-grow-1"></div>
          </div>
          <div className="row-body">
            <div className="schedules-layout">
              <ScheduleDateSlide/>
              <ScheduleData/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulePage