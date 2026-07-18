import React, { useRef } from 'react'
import remarkGfm from 'remark-gfm'
import {
  StyledMessageTimeStampLeft,
  StyledReactMarkdownMessageContentRight,
  StyledReactMarkdownMessageContentLeft,
  StyledLeftMessage,
  StyledRightMessage,
} from '../styles'
import { Avatar, Box } from '@mui/material'
import { deepOrange } from '@mui/material/colors'

export const MessageLeft = (props: {
  message: string
  timestamp: string
  displayName?: string
}) => {
  const message = props.message ? props.message : 'no message'
  const timestamp = props.timestamp ? props.timestamp : ''
  const displayName = props.displayName ? props.displayName : '不明'
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <Box sx={{ display: 'flex', paddingLeft: '6px' }}>
      <Avatar
        sx={{
          bgcolor: deepOrange[500],
          fontSize: 'medium',
        }}
      >
        {displayName}
      </Avatar>
      <StyledLeftMessage>
        <div
          ref={divRef}
          style={{
            borderRadius: 15,
            minWidth: '50vw',
            maxWidth: '70vw',
          }}
        >
          <StyledReactMarkdownMessageContentLeft
            children={message}
            skipHtml={true}
            remarkPlugins={[remarkGfm]}
          />
        </div>
        <StyledMessageTimeStampLeft>{timestamp}</StyledMessageTimeStampLeft>
      </StyledLeftMessage>
    </Box>
  )
}

export const MessageRight = (props: {
  message: string
  timestamp: string
  displayName?: string
}) => {
  const message = props.message ? props.message : 'no message'
  const displayName = props.displayName ? props.displayName : '不明'
  const timestamp = props.timestamp ? props.timestamp : ''
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <StyledRightMessage>
        <div
          ref={divRef}
          style={{
            borderRadius: 15,
            minWidth: '50vw',
            maxWidth: '70vw',
          }}
        >
          <StyledReactMarkdownMessageContentRight
            children={message}
            skipHtml={true}
            remarkPlugins={[remarkGfm]}
            // escapeHtml={false}
          />
        </div>
        <StyledMessageTimeStampLeft>
          ({displayName}) <br /> {timestamp}
        </StyledMessageTimeStampLeft>
      </StyledRightMessage>
    </Box>
  )
}
