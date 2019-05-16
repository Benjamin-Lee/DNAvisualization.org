import logging


def downsample(zone, downsample_factor=1000):
    # downsample if > downsample_factor points
    if len(zone) > downsample_factor:
        downsample = int(len(zone) / downsample_factor)
        logging.debug(f"Downsampling by a factor of {downsample}")
        downsampled = zone[::downsample]
    else:
        return zone

    # ensure that the first and last points are present
    if zone[0] != downsampled[0]:
        downsampled.insert(0, zone[0])
    if zone[-1] != downsampled[-1]:
        downsampled.append(zone[-1])

    return downsampled
