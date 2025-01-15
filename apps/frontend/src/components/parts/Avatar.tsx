import './Avatar.css'

interface AvatarProps {
  name: string | null;
  size?: 'small' | 'normal' | 'big';
}

function Avatar({ name, size = 'normal'} : AvatarProps) {
  return (
    <div className={`avatar-wrapper ${size}`}>
      <div className='avatar' data-after-content={name ? name.at(0) : '?'}></div>
    </div>
  )
}

export default Avatar;