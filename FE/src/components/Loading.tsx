type LoadingProps = {
  loading?: boolean
  overlay?: boolean
}

const Loading = ({ loading = true, overlay = false }: LoadingProps) => {
  return (
    <div id='loadingComponent'>
      {loading && (
        <div
          className={`${
            overlay
              ? 'fixed inset-0 z-[100] bg-blue-charcoal-950/80 flex justify-center items-center'
              : 'absolute inset-0 z-[100] flex justify-center items-center'
          }`}
        >
          <span className='w-12 h-12 inline-block box-border animate-spin rounded-full border-4 border-picton-blue-500 border-b-transparent border-solid'></span>
        </div>
      )}
    </div>
  )
}

export default Loading
