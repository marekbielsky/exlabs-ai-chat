import './Avatar.css'

function Avatar({ name } : {name: string | null}) {
  return (
    <div className='avatar-wrapper'>
      <div className='avatar' data-after-content={name ? name.at(0) : '?'}></div>
    </div>
  )
}

export default Avatar;