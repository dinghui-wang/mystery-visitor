import { Fragment } from 'react'
import { Text, View } from '@tarojs/components'
import { icon } from '../../constants/icons'
import type { TaskStep } from '../../services/progress'
import { cx, rpx } from '../../utils/px'
import './MvStepBar.scss'

interface MvStepBarProps {
  steps: TaskStep[]
}

export default function MvStepBar({ steps }: MvStepBarProps) {
  const currentIndex = steps.findIndex((step) => !step.done)

  return (
    <View className='mv-stepbar'>
      {steps.map((step, index) => {
        const done = step.done
        const active = !done && index === currentIndex
        const isLast = index === steps.length - 1
        return (
          <Fragment key={step.key}>
            <View className='mv-stepbar__item'>
              <View
                className={cx(
                  'mv-stepbar__dot',
                  done && 'mv-stepbar__dot--done',
                  active && 'mv-stepbar__dot--active'
                )}
              >
                {active && <View className='mv-stepbar__pulse' />}
                {done ? (
                  <View
                    className='mv-stepbar__dot-icon'
                    style={{
                      width: rpx(14),
                      height: rpx(14),
                      backgroundImage: icon('check', '#7FA88B', 2.4),
                    }}
                  />
                ) : (
                  <Text>{index + 1}</Text>
                )}
              </View>
              <Text
                className={cx(
                  'mv-stepbar__label',
                  active && 'mv-stepbar__label--active',
                  done && 'mv-stepbar__label--done'
                )}
              >
                {step.title}
              </Text>
            </View>
            {!isLast && (
              <View className={cx('mv-stepbar__line', done && 'mv-stepbar__line--done')} />
            )}
          </Fragment>
        )
      })}
    </View>
  )
}
