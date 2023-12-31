import type { Meta, StoryObj } from '@storybook/react'
import { ProfileImage } from './ProfileImage.component'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Profile/Image',
  component: ProfileImage,
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileImage>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    url: '',
    size: 1000000,
  },
}
