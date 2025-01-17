import {useParams} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useFetch} from "../../hooks/useFetch.ts";
import SectionsView from "./components/SectionsView.tsx";
import {Report} from "../../hooks/useSocket.ts";
import './Chat.css';
import {format} from "date-fns";
import Avatar from "../../components/parts/Avatar.tsx";

interface ReportEndpointResponse {
  report: string;
  startDate: Date;
  endDate: Date;
}

function Final() {
  const timeFormat = 'yyyy-MM-dd';
  const {chatId} = useParams();
  const {user} = useAuth();

  const { data } = useFetch<ReportEndpointResponse>(`chat/${chatId}/report`)

  return (
    <div className="final-report">
      <div className="report-header">
        <div className="report-header-name">
          {user.name} -{' '}
          <span>
            {format(data?.startDate, timeFormat)} - {format(data?.endDate, timeFormat)}
          </span>
        </div>
        <div className='report-header-logo'>
          <Avatar name={user.name} size='big' />
        </div>
      </div>
      <div className="final-report-content">
        {data?.report ? <SectionsView sections={JSON.parse(data.report) as Required<Report>['sections']} /> : null}
      </div>
    </div>
  )
}

export default Final;