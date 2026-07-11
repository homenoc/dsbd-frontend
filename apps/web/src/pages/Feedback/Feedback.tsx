import React from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import { Button } from '@mui/material'

export default function Feedback() {
  const feedbackPage = () => {
    window.open('https://github.com/homenoc/dsbd-feedback', '_blank')
  }

  return (
    <DashboardComponent title="about feedback">
      <h3>本システムのバグに関する問い合わせは以下で行っております</h3>
      <p>
        これらのフィードバックはgithubのIssueで管理しており、GitHubのIssue項目ページより登録のほどよろしくおねがいします
      </p>
      <p>また、修正にはかなり時間がかかる場合がございますが、ご了承ください</p>
      <Button variant={'contained'} color="primary" onClick={feedbackPage}>
        Feedbackはこちら
      </Button>
    </DashboardComponent>
  )
}
